interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "cyan" | "magenta" | "yellow";
  glowIntensity?: "normal" | "strong";
  children: React.ReactNode;
}

export function NeonButton({
  variant = "green",
  glowIntensity = "normal",
  children,
  className = "",
  ...props
}: NeonButtonProps) {
  const variantColors = {
    green: "border-neon-green text-neon-green hover:bg-neon-green",
    cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan",
    magenta: "border-neon-magenta text-neon-magenta hover:bg-neon-magenta",
    yellow: "border-neon-yellow text-neon-yellow hover:bg-neon-yellow",
  };

  const glowClass = glowIntensity === "strong" ? "hover:shadow-neon-strong" : "hover:shadow-neon";

  return (
    <button
      {...props}
      className={`
        px-6 py-3 bg-black border-2 font-mono uppercase font-bold
        hover:text-black transition-all active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-current
        ${variantColors[variant]}
        ${glowClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
