import type { ConversationStyle } from "@/lib/prompts";

interface StyleSelectorProps {
  selectedStyle: ConversationStyle;
  onStyleChange: (style: ConversationStyle) => void;
}

const styles: { value: ConversationStyle; label: string; emoji: string }[] = [
  { value: "smooth", label: "SMOOTH", emoji: "😎" },
  { value: "funny", label: "FUNNY", emoji: "😂" },
  { value: "romantic", label: "ROMANTIC", emoji: "💕" },
  { value: "poetic", label: "POETIC", emoji: "✨" },
  { value: "casual", label: "CASUAL", emoji: "👋" },
];

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {styles.map((style) => (
        <button
          key={style.value}
          onClick={() => onStyleChange(style.value)}
          className={`
            border-2 p-3 font-mono uppercase transition-all text-sm
            ${
              selectedStyle === style.value
                ? "bg-neon-magenta border-neon-magenta text-black shadow-neon-strong scale-105"
                : "border-neon-cyan text-neon-cyan hover:shadow-neon hover:scale-105"
            }
          `}
        >
          <div className="text-xl mb-1">{style.emoji}</div>
          <div className="text-xs">{style.label}</div>
        </button>
      ))}
    </div>
  );
}
