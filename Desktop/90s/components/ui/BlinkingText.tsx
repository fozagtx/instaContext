interface BlinkingTextProps {
  text: string;
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export function BlinkingText({ text, speed = "normal", className = "" }: BlinkingTextProps) {
  const speedMap = {
    slow: "animate-[blink_2s_step-end_infinite]",
    normal: "animate-blink",
    fast: "animate-[blink_0.5s_step-end_infinite]",
  };

  return (
    <span className={`${speedMap[speed]} ${className}`}>
      {text}
    </span>
  );
}
