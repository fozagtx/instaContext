import OpenAI from 'openai';
import { IntentType, IntentClassification, AgentMessageEvent } from '../../src/types/agents.js';

// Motia event step configuration
export const config = {
  type: 'event' as const,
  topic: 'message.received',
  name: 'ClassifyIntent'
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * System prompt for intent classification
 */
const INTENT_CLASSIFICATION_PROMPT = `You are an expert customer service intent classifier. Analyze customer messages and classify them into one of these categories:

INTENT CATEGORIES:
- sales: Product inquiries, pricing questions, plan upgrades, feature comparisons, demos, purchasing
- technical: Bug reports, troubleshooting, how-to questions, setup help, integration issues, performance problems
- billing: Payment questions, invoices, refunds, subscription changes, billing disputes, plan downgrades
- general: Greetings, general information, company questions

CLASSIFICATION RULES:
1. Choose the MOST SPECIFIC category that fits the message
2. If a message contains multiple intents, pick the PRIMARY intent
3. If unsure, lean towards "general" for ambiguous messages
4. Consider context clues and keywords carefully

RESPONSE FORMAT:
Respond with ONLY the category name: sales, technical, billing, or general

EXAMPLES:
"I want to upgrade my plan" → sales
"My app keeps crashing" → technical
"I was charged twice this month" → billing
"What is your company about?" → general
"How do I set up the API?" → technical
"Can I get a refund?" → billing
"I need pricing for 50 users" → sales`;

/**
 * Event handler for intent classification
 * Routes messages to appropriate agent based on classified intent
 */
export async function handler(ctx: any) {
  try {
    const { conversationId, message, customerId, timestamp } = ctx.event;

    console.log(`🔍 Classifying intent for conversation ${conversationId}`);

    // Call OpenAI for intent classification
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: INTENT_CLASSIFICATION_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.1, // Low temperature for consistent classification
      max_tokens: 10 // We only need one word
    });

    const classifiedIntent = response.choices[0].message.content?.trim().toLowerCase() as IntentType;

    // Validate the classified intent
    const validIntents: IntentType[] = ['sales', 'technical', 'billing', 'general'];
    const intent = validIntents.includes(classifiedIntent) ? classifiedIntent : 'general';

    console.log(`✅ Intent classified as: ${intent} (confidence: high)`);

    // Determine target agent based on intent
    let targetAgent: string;
    switch (intent) {
      case 'sales':
        targetAgent = 'sales';
        break;
      case 'technical':
        targetAgent = 'technical';
        break;
      case 'billing':
        targetAgent = 'billing';
        break;
      default:
        targetAgent = 'sales'; // Default to sales for general inquiries
    }

    // Create conversation context
    const context = {
      conversationId,
      messages: [
        {
          role: 'user' as const,
          content: message,
          source: customerId,
          timestamp
        }
      ],
      currentAgent: undefined,
      handoffReason: undefined
    };

    // Emit event to route to appropriate agent
    const agentEvent: AgentMessageEvent = {
      conversationId,
      agentType: targetAgent as any,
      message,
      context
    };

    await ctx.emit(`agent.${targetAgent}.message`, agentEvent);

    console.log(`📤 Message routed to ${targetAgent} agent`);

  } catch (error) {
    console.error('❌ Error in intent classification:', error);

    // Fallback to sales agent if classification fails
    const fallbackEvent: AgentMessageEvent = {
      conversationId: ctx.event.conversationId,
      agentType: 'sales',
      message: ctx.event.message,
      context: {
        conversationId: ctx.event.conversationId,
        messages: [
          {
            role: 'user',
            content: ctx.event.message,
            source: ctx.event.customerId,
            timestamp: ctx.event.timestamp
          }
        ]
      }
    };

    await ctx.emit('agent.sales.message', fallbackEvent);
    console.log('🔄 Fallback: Routed to sales agent due to classification error');
  }
}