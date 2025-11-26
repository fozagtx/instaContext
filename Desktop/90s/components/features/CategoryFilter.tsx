import type { PickupLineCategory } from "@/lib/prompts";

interface CategoryFilterProps {
  selectedCategory: PickupLineCategory;
  onCategoryChange: (category: PickupLineCategory) => void;
}

const categories: { value: PickupLineCategory; label: string; emoji: string }[] = [
  { value: "cheesy", label: "CHEESY", emoji: "🧀" },
  { value: "clever", label: "CLEVER", emoji: "🧠" },
  { value: "wholesome", label: "WHOLESOME", emoji: "💖" },
  { value: "nerdy", label: "NERDY", emoji: "🤓" },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`
            border-2 p-3 font-mono uppercase transition-all text-sm
            ${
              selectedCategory === category.value
                ? "bg-neon-yellow border-neon-yellow text-black shadow-neon-strong scale-105"
                : "border-neon-green text-neon-green hover:shadow-neon hover:scale-105"
            }
          `}
        >
          <div className="text-xl mb-1">{category.emoji}</div>
          <div className="text-xs">{category.label}</div>
        </button>
      ))}
    </div>
  );
}
