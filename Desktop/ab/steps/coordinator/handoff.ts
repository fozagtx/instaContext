import { HandoffEvent, AgentMessageEvent, ConversationContext } from '../../src/types/agents.js';

// Motia event step configuration
export const config = {
  type: 'event' as const,
  topic: 'handoff.request',
  name: 'HandoffCoordinator'
};

/**
 * Generate handoff transition message for smooth customer experience
 */
function generateHandoffMessage(fromAgent: string, toAgent: string, reason: string): string {
  const agentNames = {
    sales: 'Sales',
    technical: 'Technical Support',
    billing: 'Billing',
    human: 'Human Agent'
  };

  const fromName = agentNames[fromAgent as keyof typeof agentNames] || fromAgent;
  const toName = agentNames[toAgent as keyof typeof agentNames] || toAgent;

  const transitionMessages = {
    'sales->technical': `I'm connecting you with our Technical Support team who can help you with this technical issue. They'll have access to our full conversation history and can assist you right away.`,
    'sales->billing': `Let me connect you with our Billing team who specializes in payment and account questions. They'll be able to help you with this billing matter immediately.`,
    'technical->sales': `I'm transferring you to our Sales team who can help you with product information and upgrades. They'll continue from where we left off.`,
    'technical->billing': `I'm connecting you with our Billing department who can assist with this payment-related question. They have access to our conversation and will help you right away.`,
    'billing->sales': `Let me connect you with our Sales team who can help you explore our products and features. They'll have full context of our discussion.`,
    'billing->technical': `I'm transferring you to our Technical Support team who can help resolve this technical issue with the billing system. They're ready to assist you.`,
    'default': `I'm connecting you with our ${toName} team who can better assist you with this request. They'll have access to our full conversation history.`
  };

  const messageKey = `${fromAgent}->${toAgent}` as keyof typeof transitionMessages;
  return transitionMessages[messageKey] || transitionMessages.default;
}

/**
 * Validate handoff request to prevent infinite loops
 */
function validateHandoff(
  conversationId: string,
  fromAgent: string,
  toAgent: string,
  existingContext: ConversationContext | null
): { isValid: boolean; reason?: string } {

  // Prevent handoff to same agent
  if (fromAgent === toAgent) {
    return {
      isValid: false,
      reason: 'Cannot handoff to same agent'
    };
  }

  // Check for recent handoffs to prevent loops
  if (existingContext?.messages) {
    const recentMessages = existingContext.messages.slice(-10); // Check last 10 messages
    const recentHandoffs = recentMessages.filter(msg =>
      msg.source.includes('handoff') || msg.content.includes('connecting you with')
    );

    if (recentHandoffs.length >= 3) {
      return {
        isValid: false,
        reason: 'Too many recent handoffs detected - potential loop'
      };
    }

    // Check if we're bouncing between the same two agents
    const lastHandoffSource = existingContext.currentAgent;
    if (lastHandoffSource === toAgent) {
      return {
        isValid: false,
        reason: `Bouncing between ${fromAgent} and ${toAgent} agents detected`
      };
    }
  }

  return { isValid: true };
}

/**
 * Handoff Coordinator event handler
 * Manages seamless transitions between AI agents with context preservation
 */
export async function handler(ctx: any) {
  try {
    const { conversationId, fromAgent, toAgent, reason, context }: HandoffEvent = ctx.event;

    console.log(`🔄 Handoff request: ${fromAgent} → ${toAgent} for conversation ${conversationId}`);
    console.log(`📝 Handoff reason: ${reason}`);

    // Load existing conversation context
    const stateKey = `conversation:${conversationId}`;
    const existingContext: ConversationContext = await ctx.state.get(stateKey) || context;

    // Validate handoff to prevent loops
    const validation = validateHandoff(conversationId, fromAgent, toAgent, existingContext);
    if (!validation.isValid) {
      console.error(`❌ Handoff validation failed: ${validation.reason}`);

      // Send error message and fallback to human if available
      await ctx.emit('message.send', {
        conversationId,
        message: "I apologize for the confusion. Let me get you connected with the right person to help you. Please hold for just a moment.",
        agentType: fromAgent,
        timestamp: Date.now()
      });

      // Fallback to human agent
      if (toAgent !== 'human') {
        const humanHandoffEvent: HandoffEvent = {
          conversationId,
          fromAgent,
          toAgent: 'human',
          reason: `Handoff validation failed: ${validation.reason}`,
          context: existingContext
        };

        setTimeout(() => {
          ctx.emit('handoff.request', humanHandoffEvent);
        }, 1000);
      }
      return;
    }

    // Generate smooth transition message
    const transitionMessage = generateHandoffMessage(fromAgent, toAgent, reason);

    // Update conversation context with handoff information
    const handoffTimestamp = Date.now();
    const updatedMessages = [
      ...(existingContext.messages || []),
      {
        role: 'assistant' as const,
        content: transitionMessage,
        source: `handoff-coordinator`,
        timestamp: handoffTimestamp
      }
    ];

    const updatedContext: ConversationContext = {
      ...existingContext,
      conversationId,
      messages: updatedMessages,
      currentAgent: toAgent as any,
      handoffReason: reason
    };

    // Save updated context with handoff information
    await ctx.state.set(stateKey, updatedContext);

    // Store handoff metadata for analytics/debugging
    const handoffKey = `handoff:${conversationId}:${handoffTimestamp}`;
    await ctx.state.set(handoffKey, {
      fromAgent,
      toAgent,
      reason,
      timestamp: handoffTimestamp,
      conversationId
    });

    // Send transition message to customer
    await ctx.emit('message.send', {
      conversationId,
      message: transitionMessage,
      agentType: fromAgent,
      timestamp: handoffTimestamp
    });

    // Route to the target agent
    const targetTopic = toAgent === 'human' ? 'agent.human.message' : `agent.${toAgent}.message`;

    const agentEvent: AgentMessageEvent = {
      conversationId,
      agentType: toAgent as any,
      message: `[HANDOFF FROM ${fromAgent.toUpperCase()}] Previous agent context: ${reason}`,
      context: updatedContext
    };

    // Small delay to ensure transition message is sent first
    setTimeout(async () => {
      await ctx.emit(targetTopic, agentEvent);
      console.log(`✅ Handoff completed: ${fromAgent} → ${toAgent} for conversation ${conversationId}`);
    }, 500);

  } catch (error) {
    console.error('❌ Error in handoff coordination:', error);

    // Emergency fallback - try to send user to sales agent
    const emergencyEvent: AgentMessageEvent = {
      conversationId: ctx.event.conversationId,
      agentType: 'sales',
      message: `[EMERGENCY HANDOFF] System error during handoff. Original request: ${ctx.event.fromAgent} → ${ctx.event.toAgent}`,
      context: ctx.event.context
    };

    await ctx.emit('message.send', {
      conversationId: ctx.event.conversationId,
      message: "I apologize for the technical difficulty. Let me connect you with our sales team who can coordinate getting you the right help.",
      agentType: 'system',
      timestamp: Date.now()
    });

    await ctx.emit('agent.sales.message', emergencyEvent);
  }
}