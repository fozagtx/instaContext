import OpenAI from 'openai';
import { loadKnowledgeBase, formatKnowledgeForPrompt } from '../../src/utils/knowledge.js';
import { AgentMessageEvent, ConversationContext, HandoffEvent } from '../../src/types/agents.js';

// Motia event step configuration
export const config = {
  type: 'event' as const,
  topic: 'agent.sales.message',
  name: 'SalesAgent'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Sales Agent System Prompt
 */
const SALES_AGENT_PROMPT = `You are a professional sales representative for our company. Your role is to help customers with:
- Product inquiries and feature explanations
- Pricing and plan comparisons
- Upgrade recommendations
- Demo scheduling
- General sales questions

PERSONALITY & TONE:
- Friendly, helpful, and professional
- Enthusiastic about our products without being pushy
- Focus on understanding customer needs first
- Provide clear, concise answers
- Use the customer's name when known

HANDOFF RULES:
- If customer asks technical questions (troubleshooting, bugs, setup issues): Add [HANDOFF:TECHNICAL] to your response
- If customer asks billing questions (payments, refunds, invoices): Add [HANDOFF:BILLING] to your response
- If customer explicitly asks for human help: Add [HANDOFF:HUMAN] to your response

KNOWLEDGE BASE:
Use the following knowledge to answer questions accurately:

{knowledge}

RESPONSE GUIDELINES:
1. Always be helpful and accurate
2. If you don't know something, admit it and offer to find out
3. Focus on value and benefits, not just features
4. Ask qualifying questions to better understand needs
5. Suggest appropriate plans based on customer requirements
6. Keep responses conversational and not too long (2-3 paragraphs max)

Remember: Your goal is to help customers find the right solution for their needs while providing excellent customer service.`;

/**
 * Detect if message requires handoff to another agent
 */
function detectHandoffTriggers(message: string): { requiresHandoff: boolean; targetAgent?: string; reason?: string } {
  const messageLower = message.toLowerCase();

  // Technical handoff triggers
  const technicalKeywords = [
    'bug', 'error', 'not working', 'broken', 'crash', 'slow', 'setup', 'install', 'configure',
    'api', 'integration', 'troubleshoot', 'fix', 'issue', 'problem', 'help with', 'how to'
  ];

  // Billing handoff triggers
  const billingKeywords = [
    'bill', 'invoice', 'payment', 'charge', 'refund', 'cancel', 'subscription', 'cost',
    'money', 'paid', 'upgrade billing', 'downgrade', 'proration'
  ];

  for (const keyword of technicalKeywords) {
    if (messageLower.includes(keyword)) {
      return {
        requiresHandoff: true,
        targetAgent: 'technical',
        reason: `Customer mentioned "${keyword}" - technical issue detected`
      };
    }
  }

  for (const keyword of billingKeywords) {
    if (messageLower.includes(keyword) && !messageLower.includes('plan') && !messageLower.includes('price')) {
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
 * Sales Agent event handler
 */
export async function handler(ctx: any) {
  try {
    const { conversationId, message, context }: AgentMessageEvent = ctx.event;

    console.log(`💼 Sales Agent processing message for conversation ${conversationId}`);

    // Load conversation history from state
    const stateKey = `conversation:${conversationId}`;
    const existingContext: ConversationContext = await ctx.state.get(stateKey) || context;

    // Load sales knowledge base
    const knowledgeBases = await loadKnowledgeBase('sales');
    const knowledgeText = formatKnowledgeForPrompt(knowledgeBases);

    // Check for handoff triggers before processing
    const handoffCheck = detectHandoffTriggers(message);
    if (handoffCheck.requiresHandoff && handoffCheck.targetAgent) {
      console.log(`🔄 Handoff detected: ${handoffCheck.reason}`);

      const handoffEvent: HandoffEvent = {
        conversationId,
        fromAgent: 'sales',
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
        content: SALES_AGENT_PROMPT.replace('{knowledge}', knowledgeText)
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
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = response.choices[0].message.content || "I apologize, but I'm having trouble responding right now. Could you please try again?";

    // Check if AI response contains handoff markers
    const handoffMarkers = {
      '[HANDOFF:TECHNICAL]': 'technical',
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
        source: 'sales-agent',
        timestamp: Date.now()
      }
    ];

    const updatedContext: ConversationContext = {
      ...existingContext,
      messages: updatedMessages,
      currentAgent: 'sales'
    };

    // Save updated context to state
    await ctx.state.set(stateKey, updatedContext);

    if (shouldHandoff) {
      // Send response first, then initiate handoff
      await ctx.emit('message.send', {
        conversationId,
        message: cleanResponse,
        agentType: 'sales',
        timestamp: Date.now()
      });

      // Then request handoff
      const handoffEvent: HandoffEvent = {
        conversationId,
        fromAgent: 'sales',
        toAgent: handoffTarget as any,
        reason: 'Customer needs assistance from another department',
        context: updatedContext
      };

      await ctx.emit('handoff.request', handoffEvent);
      console.log(`🔄 Sales Agent initiated handoff to ${handoffTarget}`);
    } else {
      // Send response directly
      await ctx.emit('message.send', {
        conversationId,
        message: cleanResponse,
        agentType: 'sales',
        timestamp: Date.now()
      });

      console.log(`✅ Sales Agent responded to conversation ${conversationId}`);
    }

  } catch (error) {
    console.error('❌ Error in Sales Agent:', error);

    // Send error response
    await ctx.emit('message.send', {
      conversationId: ctx.event.conversationId,
      message: "I apologize, but I'm experiencing some technical difficulties. Let me connect you with our technical support team who can help you better.",
      agentType: 'sales',
      timestamp: Date.now()
    });

    // Handoff to technical support as fallback
    const handoffEvent: HandoffEvent = {
      conversationId: ctx.event.conversationId,
      fromAgent: 'sales',
      toAgent: 'technical',
      reason: 'Sales agent encountered an error',
      context: ctx.event.context
    };

    await ctx.emit('handoff.request', handoffEvent);
  }
}