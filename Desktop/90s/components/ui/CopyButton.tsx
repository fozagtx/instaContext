"use client";

import { useState } from "react";
import { NeonButton } from "./NeonButton";

interface CopyButtonProps {
  text: string;
  variant?: "green" | "cyan" | "magenta" | "yellow";
  className?: string;
}

export function CopyButton({ text, variant = "cyan", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="relative inline-block">
      <NeonButton
        variant={variant}
        onClick={handleCopy}
        className={className}
      >
        {copied ? "COPIED!" : "COPY"}
      </NeonButton>
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neon-magenta text-black px-3 py-1 font-retro text-xs animate-pulse-glow whitespace-nowrap">
          ✨ COPIED! ✨
        </div>
      )}
    </div>
  );
}
