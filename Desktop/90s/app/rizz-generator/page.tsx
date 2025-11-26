"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { useState } from "react";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { NeonButton } from "@/components/ui/NeonButton";
import { BlinkingText } from "@/components/ui/BlinkingText";
import { CopyButton } from "@/components/ui/CopyButton";
import { StyleSelector } from "@/components/features/StyleSelector";
import type { ConversationStyle } from "@/lib/prompts";

export default function RizzGenerator() {
  const [context, setContext] = useState("");
  const [style, setStyle] = useState<ConversationStyle>("smooth");
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input });
    setInput("");
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
            messages.map((m: UIMessage) => (
              <div key={m.id} className="mb-4">
                <div className={m.role === "user" ? "text-neon-cyan" : "text-neon-green"}>
                  <span className="font-bold">{m.role === "user" ? "> USER:" : "> AI:"}</span>
                  <p className="ml-4 mt-1 whitespace-pre-wrap">
                    {m.parts?.map((part) =>
                      part.type === 'text' ? part.text : ''
                    ).join('')}
                  </p>
                </div>
                {m.role === "assistant" && m.parts && (
                  <div className="ml-4 mt-2">
                    <CopyButton
                      text={m.parts.map((part) =>
                        part.type === 'text' ? part.text : ''
                      ).join('')}
                      variant="cyan"
                    />
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
