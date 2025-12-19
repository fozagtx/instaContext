import { MessageSendEvent } from '../../src/types/agents.js';

// Motia event step configuration
export const config = {
  type: 'event' as const,
  topic: 'message.send',
  name: 'MessageSend'
};

/**
 * Message sender event handler
 * Handles sending responses back to customers through various channels
 * In a real implementation, this would integrate with:
 * - WebSocket connections for real-time chat
 * - Webhook endpoints for external chat platforms
 * - Email systems for asynchronous responses
 */
export async function handler(ctx: any) {
  try {
    const { conversationId, message, agentType, timestamp }: MessageSendEvent = ctx.event;

    console.log(`📤 Sending message from ${agentType} agent for conversation ${conversationId}`);

    // Add agent indicator to message for clarity
    const agentIndicators = {
      sales: '💼 Sales',
      technical: '🔧 Technical Support',
      billing: '💳 Billing',
      system: '🤖 System',
      human: '👤 Human Agent'
    };

    const agentIndicator = agentIndicators[agentType as keyof typeof agentIndicators] || '🤖';
    const formattedMessage = `${agentIndicator}: ${message}`;

    // Store the outgoing message in conversation history
    const stateKey = `conversation:${conversationId}`;
    const existingContext = await ctx.state.get(stateKey) || { messages: [] };

    const updatedMessages = [
      ...existingContext.messages,
      {
        role: 'assistant' as const,
        content: message,
        source: `${agentType}-agent`,
        timestamp
      }
    ];

    const updatedContext = {
      ...existingContext,
      conversationId,
      messages: updatedMessages,
      lastMessageTime: timestamp,
      lastAgent: agentType
    };

    await ctx.state.set(stateKey, updatedContext);

    // In a real implementation, you would send this through:
    // 1. WebSocket to connected clients
    // 2. Webhook to external chat systems
    // 3. Push notification services
    // 4. Email for offline customers

    // For demo purposes, we'll emit a customer response event
    // This simulates the message being delivered to the customer
    await ctx.emit('customer.message.delivered', {
      conversationId,
      message: formattedMessage,
      agentType,
      timestamp,
      deliveryStatus: 'delivered'
    });

    console.log(`✅ Message delivered to customer for conversation ${conversationId}`);

    // Store delivery confirmation
    const deliveryKey = `delivery:${conversationId}:${timestamp}`;
    await ctx.state.set(deliveryKey, {
      messageId: `msg_${timestamp}`,
      conversationId,
      agentType,
      deliveredAt: Date.now(),
      status: 'delivered'
    }, { ttl: 24 * 60 * 60 * 1000 }); // 24 hour TTL

  } catch (error) {
    console.error('❌ Error sending message:', error);

    // Emit delivery failure event for monitoring
    await ctx.emit('customer.message.failed', {
      conversationId: ctx.event.conversationId,
      message: ctx.event.message,
      agentType: ctx.event.agentType,
      timestamp: ctx.event.timestamp,
      error: error.message || 'Unknown error'
    });

    // In a production system, you might want to:
    // 1. Retry delivery with exponential backoff
    // 2. Queue message for later delivery
    // 3. Alert monitoring systems
    // 4. Fallback to alternative delivery methods
  }
}