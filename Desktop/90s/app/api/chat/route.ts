import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context, style } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const systemPrompt = `You are the ultimate 90s-style AI Rizz Assistant with a rad personality.
Help users craft ${style || "smooth"} messages for their romantic interests.
${context ? `Context: ${context}` : ""}

Be charming, authentic, and contextually aware. Avoid cringe or overly aggressive lines.
Match the ${style || "smooth"} style requested. Keep responses concise and natural.
Add a touch of 90s slang when appropriate (but don't overdo it).`;

    // Convert UIMessages to ModelMessages and filter out empty ones
    const modelMessages = convertToModelMessages(messages).filter((msg) => {
      if (typeof msg.content === "string") {
        return msg.content.trim().length > 0;
      }
      if (Array.isArray(msg.content)) {
        return msg.content.length > 0;
      }
      return false;
    });

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request. Check your API key." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
