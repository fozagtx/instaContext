import OpenAI from 'openai';
import { loadKnowledgeBase, formatKnowledgeForPrompt } from '../../src/utils/knowledge.js';
import { AgentMessageEvent, ConversationContext, HandoffEvent } from '../../src/types/agents.js';

// Motia event step configuration
export const config = {
  type: 'event' as const,
  topic: 'agent.billing.message',
  name: 'BillingAgent'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Billing Agent System Prompt
 */
const BILLING_AGENT_PROMPT = `You are a billing and payments specialist. Your role is to help customers with:
- Payment and billing questions
- Invoice inquiries and disputes
- Subscription management (cancellations, changes)
- Refund requests and processing
- Plan downgrades and upgrades
- Payment method updates
- Billing policy explanations

PERSONALITY & TONE:
- Professional, understanding, and solution-focused
- Empathetic to billing concerns and frustrations
- Clear about policies while being helpful
- Thorough in explaining charges and processes
- Proactive in preventing future billing issues

HANDOFF RULES:
- If customer asks about product features or wants to upgrade: Add [HANDOFF:SALES] to your response
- If customer has technical issues with billing system/dashboard: Add [HANDOFF:TECHNICAL] to your response
- If customer explicitly asks for human help or has complex billing disputes: Add [HANDOFF:HUMAN] to your response

BILLING ASSISTANCE APPROACH:
1. Acknowledge the billing concern with empathy
2. Gather specific details (invoice numbers, dates, amounts)
3. Look up relevant policy information
4. Explain charges or policies clearly
5. Provide step-by-step solutions
6. Follow up on resolution timelines
7. Proactively suggest ways to avoid future issues

KNOWLEDGE BASE:
Use the following billing policies and plan information:

{knowledge}

RESPONSE GUIDELINES:
1. Always acknowledge billing concerns with understanding
2. Be transparent about policies and procedures
3. Provide specific timelines for resolutions
4. Explain any fees or charges clearly
5. Offer alternatives when possible
6. Be proactive about preventing future billing issues
7. Use clear, non-technical language for billing terms

IMPORTANT POLICIES TO REMEMBER:
- Refunds must be requested within 30 days
- Late fees apply after 7-day grace period
- Downgrades are prorated
- Cancellations take effect at end of billing period

Remember: Your goal is to resolve billing issues fairly while maintaining customer trust and satisfaction.`;

/**
 * Detect if message requires handoff to another agent
 */
function detectHandoffTriggers(message: string): { requiresHandoff: boolean; targetAgent?: string; reason?: string } {
  const messageLower = message.toLowerCase();

  // Sales handoff triggers
  const salesKeywords = [
    'upgrade features', 'add features', 'which plan', 'compare plans', 'demo',
    'more storage', 'need more users', 'enterprise features', 'custom plan'
  ];

  // Technical handoff triggers
  const technicalKeywords = [
    'billing dashboard not working', 'can\'t update payment', 'payment system error',
    'billing page won\'t load', 'can\'t download invoice', 'billing system bug'
  ];

  for (const keyword of salesKeywords) {
    if (messageLower.includes(keyword)) {
      return {
        requiresHandoff: true,
        targetAgent: 'sales',
        reason: `Customer interested in "${keyword}" - sales opportunity detected`
      };
    }
  }

  for (const keyword of technicalKeywords) {
    if (messageLower.includes(keyword)) {
      return {
        requiresHandoff: true,
        targetAgent: 'technical',
        reason: `Customer experiencing technical issue: "${keyword}"`
      };
    }
  }

  return { requiresHandoff: false };
}

/**
 * Billing Agent event handler
 */
export async function handler(ctx: any) {
  try {
    const { conversationId, message, context }: AgentMessageEvent = ctx.event;

    console.log(`💳 Billing Agent processing message for conversation ${conversationId}`);

    // Load conversation history from state
    const stateKey = `conversation:${conversationId}`;
    const existingContext: ConversationContext = await ctx.state.get(stateKey) || context;

    // Load billing knowledge base
    const knowledgeBases = await loadKnowledgeBase('billing');
    const knowledgeText = formatKnowledgeForPrompt(knowledgeBases);

    // Check for handoff triggers before processing
    const handoffCheck = detectHandoffTriggers(message);
    if (handoffCheck.requiresHandoff && handoffCheck.targetAgent) {
      console.log(`🔄 Handoff detected: ${handoffCheck.reason}`);

      const handoffEvent: HandoffEvent = {
        conversationId,
        fromAgent: 'billing',
        toAgent: handoffCheck.targetAgent as any,
        reason: handoffCheck.reason!,
        context: existingContext
      };

      await ctx.emit('handoff.request', handoffEvent);
      return;
    }

    // Prepare conversation history for OpenAI
    const conversationHistory = existingContext.messages || [];
    const openaiMessages = [
      {
        role: 'system' as const,
        content: BILLING_AGENT_PROMPT.replace('{knowledge}', knowledgeText)
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Generate response using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openaiMessages,
      temperature: 0.2, // Very low temperature for consistent billing responses
      max_tokens: 500
    });

    const aiResponse = response.choices[0].message.content || "I apologize, but I'm having trouble accessing billing information right now. Let me connect you with our billing department who can help you immediately.";

    // Check if AI response contains handoff markers
    const handoffMarkers = {
      '[HANDOFF:SALES]': 'sales',
      '[HANDOFF:TECHNICAL]': 'technical',
      '[HANDOFF:HUMAN]': 'human'
    };

    let cleanResponse = aiResponse;
    let shouldHandoff = false;
    let handoffTarget = '';

    for (const [marker, target] of Object.entries(handoffMarkers)) {
      if (aiResponse.includes(marker)) {
        cleanResponse = aiResponse.replace(marker, '').trim();
        shouldHandoff = true;
        handoffTarget = target;
        break;
      }
    }

    // Update conversation history
    const updatedMessages = [
      ...conversationHistory,
      {
        role: 'assistant' as const,
        content: cleanResponse,
        source: 'billing-agent',
        timestamp: Date.now()
      }
    ];

    const updatedContext: ConversationContext = {
      ...existingContext,
      messages: updatedMessages,
      currentAgent: 'billing'
    };

    // Save updated context to state
    await ctx.state.set(stateKey, updatedContext);

    if (shouldHandoff) {
      // Send response first, then initiate handoff
      await ctx.emit('message.send', {
        conversationId,
        message: cleanResponse,
        agentType: 'billing',
        timestamp: Date.now()
      });

      // Then request handoff
      const handoffEvent: HandoffEvent = {
        conversationId,
        fromAgent: 'billing',
        toAgent: handoffTarget as any,
        reason: 'Customer needs assistance from another department',
        context: updatedContext
      };

      await ctx.emit('handoff.request', handoffEvent);
      console.log(`🔄 Billing Agent initiated handoff to ${handoffTarget}`);
    } else {
      // Send response directly
      await ctx.emit('message.send', {
        conversationId,
        message: cleanResponse,
        agentType: 'billing',
        timestamp: Date.now()
      });

      console.log(`✅ Billing Agent responded to conversation ${conversationId}`);
    }

  } catch (error) {
    console.error('❌ Error in Billing Agent:', error);

    // Send error response
    await ctx.emit('message.send', {
      conversationId: ctx.event.conversationId,
      message: "I apologize for the technical difficulty. Let me connect you with our sales team who can coordinate getting you immediate billing assistance.",
      agentType: 'billing',
      timestamp: Date.now()
    });

    // Handoff to sales as fallback
    const handoffEvent: HandoffEvent = {
      conversationId: ctx.event.conversationId,
      fromAgent: 'billing',
      toAgent: 'sales',
      reason: 'Billing agent encountered an error',
      context: ctx.event.context
    };

    await ctx.emit('handoff.request', handoffEvent);
  }
}