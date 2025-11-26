import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { rizzGeneratorPrompt } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { messages, context, style } = await req.json();

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: rizzGeneratorPrompt(context || '', style || 'smooth'),
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}