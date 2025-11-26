import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ["var(--font-retro)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
        comic: ['"Comic Sans MS"', "cursive"],
      },
      colors: {
        "neon-green": "#00FF00",
        "neon-cyan": "#00FFFF",
        "neon-magenta": "#FF00FF",
        "neon-yellow": "#FFFF00",
        "neon-orange": "#FF6B35",
      },
      boxShadow: {
        neon: "0 0 10px currentColor, 0 0 20px currentColor",
        "neon-strong": "0 0 10px currentColor, 0 0 40px currentColor, 0 0 80px currentColor",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        marquee: "marquee 20s linear infinite",
        scanline: "scanline 8s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            textShadow: "0 0 10px currentColor, 0 0 20px currentColor",
          },
          "50%": {
            textShadow: "0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
