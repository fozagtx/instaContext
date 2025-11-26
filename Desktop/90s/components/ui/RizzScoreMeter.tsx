"use client";

import { useEffect, useState } from "react";

interface RizzScoreMeterProps {
  score: number; // 0-100
  className?: string;
}

export function RizzScoreMeter({ score, className = "" }: RizzScoreMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(interval);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score]);

  const getScoreColor = () => {
    if (animatedScore >= 80) return "text-neon-green";
    if (animatedScore >= 60) return "text-neon-cyan";
    if (animatedScore >= 40) return "text-neon-yellow";
    return "text-neon-magenta";
  };

  const getScoreLabel = () => {
    if (animatedScore >= 80) return "🔥 FIRE RIZZ 🔥";
    if (animatedScore >= 60) return "💚 SOLID GAME 💚";
    if (animatedScore >= 40) return "⚡ GETTING THERE ⚡";
    return "💪 NEEDS WORK 💪";
  };

  return (
    <div className={`border-4 border-neon-cyan bg-black p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="font-retro text-neon-cyan text-sm mb-2">RIZZ SCORE</h3>
      </div>

      {/* Meter Container */}
      <div className="relative h-32 border-2 border-neon-green bg-gray-900 mb-4">
        {/* Fill */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            animatedScore >= 80
              ? "bg-neon-green"
              : animatedScore >= 60
                ? "bg-neon-cyan"
                : animatedScore >= 40
                  ? "bg-neon-yellow"
                  : "bg-neon-magenta"
          }`}
          style={{ height: `${animatedScore}%` }}
        >
          <div className="absolute inset-0 opacity-50 animate-pulse" />
        </div>

        {/* Grid Lines */}
        {[25, 50, 75].map((line) => (
          <div
            key={line}
            className="absolute left-0 right-0 border-t border-neon-cyan opacity-30"
            style={{ bottom: `${line}%` }}
          />
        ))}
      </div>

      {/* Score Display */}
      <div className="text-center">
        <div className={`font-retro text-4xl mb-2 ${getScoreColor()} animate-pulse-glow`}>
          {animatedScore}
        </div>
        <div className="font-mono text-neon-yellow text-sm animate-blink">
          {getScoreLabel()}
        </div>
      </div>
    </div>
  );
}
