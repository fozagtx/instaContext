import OpenAI from 'openai';
import { loadKnowledgeBase, formatKnowledgeForPrompt } from '../../src/utils/knowledge.js';
import { AgentMessageEvent, ConversationContext, HandoffEvent } from '../../src/types/agents.js';

// Motia event step configuration
export const config = {
  type: 'event' as const,
  topic: 'agent.technical.message',
  name: 'TechnicalAgent'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Technical Support Agent System Prompt
 */
const TECHNICAL_AGENT_PROMPT = `You are a technical support specialist. Your role is to help customers with:
- Troubleshooting technical issues
- Setup and configuration guidance
- Bug reports and error resolution
- Integration assistance
- Performance optimization
- API and development questions

PERSONALITY & TONE:
- Patient, methodical, and technically knowledgeable
- Break down complex solutions into simple steps
- Ask diagnostic questions to understand issues better
- Provide clear, step-by-step instructions
- Empathetic when customers are frustrated

HANDOFF RULES:
- If customer wants to buy/upgrade products or asks about pricing: Add [HANDOFF:SALES] to your response
- If customer asks about billing, payments, or refunds: Add [HANDOFF:BILLING] to your response
- If customer explicitly asks for human help or you can't solve the issue: Add [HANDOFF:HUMAN] to your response

TROUBLESHOOTING APPROACH:
1. Acknowledge the issue and empathize
2. Gather relevant information (browser, device, error messages, etc.)
3. Provide step-by-step solutions starting with the simplest
4. Ask for confirmation that each step worked
5. If basic solutions don't work, escalate to advanced troubleshooting
6. Document any bugs or recurring issues

KNOWLEDGE BASE:
Use the following technical documentation and troubleshooting guides:

{knowledge}

RESPONSE GUIDELINES:
1. Always start by acknowledging the customer's issue
2. Ask clarifying questions if needed to understand the problem
3. Provide solutions in numbered, easy-to-follow steps
4. Use bullet points for lists or options
5. Explain technical concepts in simple terms
6. Include relevant links or references when helpful
7. Follow up to ensure the solution worked

Remember: Your goal is to resolve technical issues efficiently while providing an excellent support experience.`;

/**
 * Detect if message requires handoff to another agent
 */
function detectHandoffTriggers(message: string): { requiresHandoff: boolean; targetAgent?: string; reason?: string } {
  const messageLower = message.toLowerCase();

  // Sales handoff triggers
  const salesKeywords = [
    'buy', 'purchase', 'upgrade', 'plan', 'pricing', 'cost', 'demo', 'trial',
    'features', 'compare plans', 'which plan', 'how much'
  ];

  // Billing handoff triggers
  const billingKeywords = [
    'bill', 'invoice', 'payment', 'charge', 'refund', 'cancel subscription',
    'billing issue', 'charged twice', 'credit card', 'payment failed'
  ];

  for (const keyword of salesKeywords) {
    if (messageLower.includes(keyword)) {
      return {
        requiresHandoff: true,
        targetAgent: 'sales',
        reason: `Customer inquired about "${keyword}" - sales topic detected`
      };
    }
  }

  for (const keyword of billingKeywords) {
    if (messageLower.includes(keyword)) {
      return {
        requiresHandoff: true,
        targetAgent: 'billing',
        reason: `Customer mentioned "${keyword}" - billing issue detected`
      };
    }
  }

  return { requiresHandoff: false };
}

/**
 * Technical Support Agent event handler
 */
export async function handler(ctx: any) {
  try {
    const { conversationId, message, context }: AgentMessageEvent = ctx.event;

    console.log(`🔧 Technical Agent processing message for conversation ${conversationId}`);

    // Load conversation history from state
    const stateKey = `conversation:${conversationId}`;
    const existingContext: ConversationContext = await ctx.state.get(stateKey) || context;

    // Load technical knowledge base
    const knowledgeBases = await loadKnowledgeBase('technical');
    const knowledgeText = formatKnowledgeForPrompt(knowledgeBases);

    // Check for handoff triggers before processing
    const handoffCheck = detectHandoffTriggers(message);
    if (handoffCheck.requiresHandoff && handoffCheck.targetAgent) {
      console.log(`🔄 Handoff detected: ${handoffCheck.reason}`);

      const handoffEvent: HandoffEvent = {
        conversationId,
        fromAgent: 'technical',
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
        content: TECHNICAL_AGENT_PROMPT.replace('{knowledge}', knowledgeText)
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
      temperature: 0.3, // Lower temperature for more consistent technical responses
      max_tokens: 600
    });

    const aiResponse = response.choices[0].message.content || "I apologize, but I'm having trouble accessing my technical knowledge right now. Could you please try again?";

    // Check if AI response contains handoff markers
    const handoffMarkers = {
      '[HANDOFF:SALES]': 'sales',
      '[HANDOFF:BILLING]': 'billing',
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
        source: 'technical-agent',
        timestamp: Date.now()
      }
    ];

    const updatedContext: ConversationContext = {
      ...existingContext,
      messages: updatedMessages,
      currentAgent: 'technical'
    };

    // Save updated context to state
    await ctx.state.set(stateKey, updatedContext);

    if (shouldHandoff) {
      // Send response first, then initiate handoff
      await ctx.emit('message.send', {
        conversationId,
        message: cleanResponse,
        agentType: 'technical',
        timestamp: Date.now()
      });

      // Then request handoff
      const handoffEvent: HandoffEvent = {
        conversationId,
        fromAgent: 'technical',
        toAgent: handoffTarget as any,
        reason: 'Customer needs assistance from another department',
        context: updatedContext
      };

      await ctx.emit('handoff.request', handoffEvent);
      console.log(`🔄 Technical Agent initiated handoff to ${handoffTarget}`);
    } else {
      // Send response directly
      await ctx.emit('message.send', {
        conversationId,
        message: cleanResponse,
        agentType: 'technical',
        timestamp: Date.now()
      });

      console.log(`✅ Technical Agent responded to conversation ${conversationId}`);
    }

  } catch (error) {
    console.error('❌ Error in Technical Agent:', error);

    // Send error response
    await ctx.emit('message.send', {
      conversationId: ctx.event.conversationId,
      message: "I'm experiencing some technical difficulties on my end. Let me connect you with our sales team who can help coordinate getting you the right technical support.",
      agentType: 'technical',
      timestamp: Date.now()
    });

    // Handoff to sales as fallback
    const handoffEvent: HandoffEvent = {
      conversationId: ctx.event.conversationId,
      fromAgent: 'technical',
      toAgent: 'sales',
      reason: 'Technical agent encountered an error',
      context: ctx.event.context
    };

    await ctx.emit('handoff.request', handoffEvent);
  }
}