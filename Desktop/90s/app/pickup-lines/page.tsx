"use client";

import { useState, useEffect } from "react";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { NeonButton } from "@/components/ui/NeonButton";
import { BlinkingText } from "@/components/ui/BlinkingText";
import { CopyButton } from "@/components/ui/CopyButton";
import { CategoryFilter } from "@/components/features/CategoryFilter";
import { FavoritesList } from "@/components/features/FavoritesList";
import { storage } from "@/lib/storage";
import { pickupLinePrompt, type PickupLineCategory } from "@/lib/prompts";
import type { Favorite } from "@/lib/storage";

export default function PickupLines() {
  const [category, setCategory] = useState<PickupLineCategory>("clever");
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(storage.getFavorites());
  }, []);

  const generateLine = async () => {
    setIsGenerating(true);
    setShowSpinner(true);
    setCurrentLine(null);

    // Show spinner for at least 1 second for effect
    setTimeout(() => setShowSpinner(false), 1000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              parts: [{ type: "text", text: pickupLinePrompt(category) }],
            },
          ],
          context: `pickup line generation - ${category}`,
          style: category,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
        }
      }

      setCurrentLine(fullText.trim());
    } catch (error) {
      console.error("Generation error:", error);
      setCurrentLine("❌ Generation failed. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFavorite = () => {
    if (!currentLine) return;

    try {
      const newFavorite = storage.saveFavorite(currentLine, category);
      if (newFavorite) {
        setFavorites(storage.getFavorites());
        alert("✨ Saved to favorites!");
      } else {
        alert("⚠️ This line is already in your favorites!");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`❌ ${error.message}`);
      }
    }
  };

  const handleRemoveFavorite = (id: string) => {
    if (storage.removeFavorite(id)) {
      setFavorites(storage.getFavorites());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator Column */}
        <RetroWindow title="🎲 PICKUP LINE GENERATOR v1.0 🎲">
          {/* Category Filter */}
          <div className="mb-6">
            <label className="text-neon-green font-mono block mb-3 text-sm">
              🎯 SELECT CATEGORY:
            </label>
            <CategoryFilter selectedCategory={category} onCategoryChange={setCategory} />
          </div>

          {/* Generate Button */}
          <div className="mb-6">
            <NeonButton
              onClick={generateLine}
              disabled={isGenerating}
              variant="yellow"
              className="w-full text-lg py-4"
            >
              {isGenerating ? "GENERATING..." : "🎰 GENERATE LINE"}
            </NeonButton>
          </div>

          {/* Spinner Animation */}
          {showSpinner && (
            <div className="text-center py-8">
              <div className="text-6xl animate-spin inline-block">🎲</div>
              <div className="mt-4">
                <BlinkingText text="⚡ ROLLING THE DICE..." className="text-neon-yellow" />
              </div>
            </div>
          )}

          {/* Generated Line Display */}
          {!showSpinner && currentLine && (
            <div className="border-4 border-neon-green bg-gray-900 p-6">
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-neon-yellow text-black font-mono text-xs">
                  {category.toUpperCase()}
                </span>
              </div>
              <p className="text-neon-green font-mono text-lg leading-relaxed text-center mb-6">
                &quot;{currentLine}&quot;
              </p>
              <div className="flex gap-2 justify-center">
                <CopyButton text={currentLine} variant="cyan" />
                <NeonButton onClick={handleSaveFavorite} variant="magenta">
                  💾 SAVE
                </NeonButton>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 border-2 border-neon-cyan bg-black p-3">
            <p className="text-neon-cyan font-mono text-xs">
              💡 TIP: Try different categories to find your style!
            </p>
          </div>
        </RetroWindow>

        {/* Favorites Column */}
        <RetroWindow title="💾 SAVED FAVORITES 💾">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-neon-magenta text-sm">
              {favorites.length} / 50 SAVED
            </h3>
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all favorites?")) {
                    storage.clearFavorites();
                    setFavorites([]);
                  }
                }}
                className="font-mono text-xs text-neon-magenta hover:text-neon-yellow transition-colors"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2">
            <FavoritesList favorites={favorites} onRemove={handleRemoveFavorite} />
          </div>
        </RetroWindow>
      </div>
    </div>
  );
}
