"use client";

import { useEffect, useState } from "react";

export function Footer90s() {
  const [hitCount, setHitCount] = useState(0);

  useEffect(() => {
    // Fake rolling hit counter animation
    const interval = setInterval(() => {
      setHitCount((prev) => prev + 1);
    }, 100);

    // Stop after reaching a random number
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setHitCount(Math.floor(Math.random() * 9000) + 1000);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <footer className="relative z-10 border-t-4 border-neon-magenta bg-black mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Hit Counter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-neon-yellow text-sm">VISITORS:</span>
            <div className="flex gap-1 bg-black border-2 border-neon-green px-3 py-2">
              {hitCount
                .toString()
                .padStart(6, "0")
                .split("")
                .map((digit, i) => (
                  <span
                    key={i}
                    className="font-mono text-neon-green text-xl font-bold bg-gray-900 px-1"
                  >
                    {digit}
                  </span>
                ))}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-center gap-2">
            <div className="border-2 border-neon-cyan px-4 py-2 bg-black">
              <span className="font-mono text-neon-cyan text-xs">
                🌐 BEST VIEWED IN NETSCAPE NAVIGATOR 🌐
              </span>
            </div>
            <div className="border-2 border-neon-magenta px-4 py-2 bg-black">
              <span className="font-mono text-neon-magenta text-xs">
                ⚡ POWERED BY CLAUDE AI ⚡
              </span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="font-mono text-neon-green text-xs">
              © {new Date().getFullYear()} 90s Rizz Tool
            </p>
            <p className="font-mono text-neon-cyan text-xs mt-1">
              Made with 💚 and nostalgia
            </p>
          </div>
        </div>

        {/* Under Construction GIF aesthetic */}
        <div className="mt-6 text-center">
          <span className="font-mono text-neon-yellow text-xs animate-blink">
            🚧 ALWAYS UNDER CONSTRUCTION 🚧
          </span>
        </div>
      </div>
    </footer>
  );
}
