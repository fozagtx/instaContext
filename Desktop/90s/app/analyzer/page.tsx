"use client";

import { useState } from "react";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { NeonButton } from "@/components/ui/NeonButton";
import { BlinkingText } from "@/components/ui/BlinkingText";
import { RizzScoreMeter } from "@/components/ui/RizzScoreMeter";

export default function Analyzer() {
  const [conversation, setConversation] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [rizzScore, setRizzScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!conversation.trim()) return;

    setIsLoading(true);
    setAnalysis(null);
    setRizzScore(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze this conversation:\n\n${conversation}`,
            },
          ],
          context: "conversation analysis",
          style: "analytical",
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const data = line.slice(2);
              fullText += data;
              setAnalysis(fullText);
            }
          }
        }
      }

      // Extract score from analysis (look for numbers 0-100)
      const scoreMatch = fullText.match(/\b([0-9]{1,3})\b/);
      if (scoreMatch) {
        const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
        setRizzScore(score);
      } else {
        setRizzScore(75); // Default score if not found
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("❌ Analysis failed. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RetroWindow title="🔍 CONVERSATION ANALYZER v1.0 🔍" className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div>
            <div className="mb-4">
              <label className="text-neon-green font-mono block mb-2 text-sm">
                💬 PASTE YOUR CONVERSATION:
              </label>
              <textarea
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                placeholder="Paste your conversation thread here...&#10;&#10;You: Hey! How's it going?&#10;Them: Pretty good! Just finished work.&#10;You: Nice! Want to grab coffee sometime?"
                className="w-full h-64 bg-black border-2 border-neon-cyan p-3 text-neon-green 
                           font-mono focus:shadow-neon focus:border-neon-magenta outline-none text-sm
                           resize-none"
              />
            </div>

            <NeonButton
              onClick={handleAnalyze}
              disabled={isLoading || !conversation.trim()}
              variant="magenta"
              className="w-full"
            >
              {isLoading ? "ANALYZING..." : "ANALYZE RIZZ"}
            </NeonButton>

            <div className="mt-4 border-2 border-neon-yellow bg-black p-3">
              <p className="text-neon-yellow font-mono text-xs">
                💡 TIP: Include both sides of the conversation for best results!
              </p>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            {isLoading && (
              <div className="text-center py-12">
                <BlinkingText text="⚡ ANALYZING YOUR RIZZ..." className="text-neon-cyan text-lg" />
              </div>
            )}

            {!isLoading && !analysis && (
              <div className="text-center py-12 text-neon-cyan font-mono text-sm">
                <p className="mb-2">👈 Paste a conversation and hit analyze</p>
                <p className="text-xs">Get AI-powered feedback on your game!</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                {/* Rizz Score Meter */}
                {rizzScore !== null && <RizzScoreMeter score={rizzScore} />}

                {/* Analysis Results */}
                <div className="border-2 border-neon-green bg-gray-900 p-4">
                  <h3 className="font-retro text-neon-green text-xs mb-3">📊 ANALYSIS:</h3>
                  <div className="font-mono text-neon-cyan text-sm whitespace-pre-wrap leading-relaxed">
                    {analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </RetroWindow>
    </div>
  );
}
