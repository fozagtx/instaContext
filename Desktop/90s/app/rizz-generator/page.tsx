"use client";

import { useState } from "react";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { NeonButton } from "@/components/ui/NeonButton";
import { BlinkingText } from "@/components/ui/BlinkingText";
import { CopyButton } from "@/components/ui/CopyButton";
import { StyleSelector } from "@/components/features/StyleSelector";
import type { ConversationStyle } from "@/lib/prompts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function RizzGenerator() {
  const [context, setContext] = useState("");
  const [style, setStyle] = useState<ConversationStyle>("smooth");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            parts: [{ type: "text", text: m.content }],
          })),
          context,
          style,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantMessage } : m
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "❌ Error: Failed to get response. Check your API key.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RetroWindow title="💘 AI RIZZ GENERATOR v1.0 💘" className="max-w-4xl mx-auto">
        {/* Marquee Header */}
        <div className="overflow-hidden mb-6 border-2 border-neon-cyan bg-black p-2">
          <div className="animate-marquee whitespace-nowrap text-neon-cyan font-mono text-sm">
            ✨ WELCOME TO THE ULTIMATE RIZZ ZONE ✨ GET YOUR GAME UP ✨
          </div>
        </div>

        {/* Context Input */}
        <div className="mb-6">
          <label className="text-neon-green font-mono block mb-2 text-sm">
            📝 SITUATION CONTEXT:
          </label>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., first date, anniversary, morning text..."
            className="w-full bg-black border-2 border-neon-cyan p-3 text-neon-green font-mono
                       focus:shadow-neon focus:border-neon-magenta outline-none text-sm"
          />
        </div>

        {/* Style Selector */}
        <div className="mb-6">
          <label className="text-neon-green font-mono block mb-3 text-sm">
            🎭 RIZZ STYLE:
          </label>
          <StyleSelector selectedStyle={style} onStyleChange={setStyle} />
        </div>

        {/* Chat Interface */}
        <div className="bg-gray-900 border-2 border-neon-green p-4 h-64 overflow-y-auto mb-4
                        font-mono text-sm space-y-3">
          {messages.length === 0 ? (
            <div className="text-neon-cyan text-center py-8">
              <p className="mb-2">👋 Ready to level up your rizz game?</p>
              <p className="text-xs">Enter a situation and ask for message suggestions!</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="mb-4">
                <div className={m.role === "user" ? "text-neon-cyan" : "text-neon-green"}>
                  <span className="font-bold">{m.role === "user" ? "> USER:" : "> AI:"}</span>
                  <p className="ml-4 mt-1 whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === "assistant" && m.content && !m.content.startsWith("❌") && (
                  <div className="ml-4 mt-2">
                    <CopyButton text={m.content} variant="cyan" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-neon-yellow">
              <BlinkingText text="⚡ AI PROCESSING..." />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request... (e.g., 'Give me a message to send')"
            className="flex-1 bg-black border-2 border-neon-cyan p-3 text-neon-green
                       font-mono focus:shadow-neon outline-none text-sm"
            disabled={isLoading}
          />
          <NeonButton type="submit" disabled={isLoading} variant="green">
            {isLoading ? "GENERATING..." : "RIZZ ME UP!"}
          </NeonButton>
        </form>

        {/* Tips */}
        <div className="mt-4 border-2 border-neon-yellow bg-black p-3">
          <p className="text-neon-yellow font-mono text-xs">
            💡 TIP: Be specific about your situation for better suggestions!
          </p>
        </div>
      </RetroWindow>
    </div>
  );
}
