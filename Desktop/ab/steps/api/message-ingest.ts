import { z } from 'zod';
import { CustomerMessage, MessageReceivedEvent } from '../../src/types/agents.js';

// Motia API step configuration
export const config = {
  type: 'api' as const,
  path: '/api/messages',
  method: 'POST' as const,
  name: 'MessageIngest'
};

// Request body validation schema
const RequestSchema = z.object({
  customerId: z.string().min(1),
  message: z.string().min(1),
  sessionId: z.string().optional()
});

/**
 * API endpoint to receive customer messages
 * Validates input and emits message.received event for processing
 */
export async function handler(ctx: any) {
  try {
    // Validate request body
    const validationResult = RequestSchema.safeParse(ctx.request.body);

    if (!validationResult.success) {
      return {
        status: 400,
        body: {
          error: 'Invalid request body',
          details: validationResult.error.issues
        }
      };
    }

    const { customerId, message, sessionId } = validationResult.data;
    const timestamp = Date.now();

    // Create conversation ID (use sessionId if provided, otherwise generate one)
    const conversationId = sessionId || `conv_${customerId}_${timestamp}`;

    // Log the incoming message
    console.log(`📨 Message received from customer ${customerId}:`, {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      conversationId,
      timestamp
    });

    // Emit event to trigger message processing
    const event: MessageReceivedEvent = {
      customerId,
      message,
      timestamp,
      sessionId: conversationId
    };

    await ctx.emit('message.received', {
      conversationId,
      customerId,
      message,
      timestamp
    });

    // Return success response
    return {
      status: 200,
      body: {
        message: 'Message received successfully',
        conversationId,
        timestamp
      }
    };

  } catch (error) {
    console.error('❌ Error in message ingestion:', error);

    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Failed to process message'
      }
    };
  }
}