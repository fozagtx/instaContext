"use client";

import { CopyButton } from "@/components/ui/CopyButton";

interface Favorite {
  id: string;
  line: string;
  category: string;
}

interface FavoritesListProps {
  favorites: Favorite[];
  onRemove: (id: string) => void;
}

export function FavoritesList({ favorites, onRemove }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="border-2 border-neon-magenta bg-gray-900 p-6 text-center">
        <p className="text-neon-magenta font-mono text-sm">
          💾 No favorites saved yet!
        </p>
        <p className="text-neon-cyan font-mono text-xs mt-2">
          Generate some pickup lines and save your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="border-2 border-neon-magenta bg-gray-900 p-4 hover:border-neon-cyan transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="inline-block px-2 py-1 bg-neon-yellow text-black font-mono text-xs mb-2">
                {favorite.category.toUpperCase()}
              </span>
              <p className="text-neon-green font-mono text-sm leading-relaxed">
                {favorite.line}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <CopyButton text={favorite.line} variant="cyan" className="text-xs px-3 py-2" />
              <button
                onClick={() => onRemove(favorite.id)}
                className="border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta 
                           hover:text-black px-3 py-2 font-mono text-xs transition-all"
                aria-label="Remove favorite"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
