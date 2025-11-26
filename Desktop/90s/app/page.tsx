import Link from "next/link";
import { RetroWindow } from "@/components/ui/RetroWindow";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-retro text-3xl md:text-5xl text-neon-green mb-4 animate-pulse-glow">
          💘 90s AI RIZZ TOOL 💘
        </h1>
        <div className="overflow-hidden mb-6">
          <p className="font-mono text-neon-cyan text-lg md:text-xl">
            ✨ Level Up Your Game With AI-Powered 90s Vibes ✨
          </p>
        </div>
        <p className="font-mono text-neon-magenta text-sm max-w-2xl mx-auto">
          Welcome to the most radical rizz tool on the internet! Powered by Claude AI and dripping with 90s nostalgia.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Rizz Generator Card */}
        <Link href="/rizz-generator" className="block group">
          <RetroWindow title="💬 RIZZ GENERATOR" className="h-full hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-6xl mb-4">💘</div>
              <h3 className="font-retro text-neon-green text-sm mb-3">RIZZ GENERATOR</h3>
              <p className="font-mono text-neon-cyan text-xs leading-relaxed">
                Get AI-powered message suggestions tailored to your situation. Choose your style and let the AI work its magic!
              </p>
              <div className="mt-4 font-mono text-neon-yellow text-xs group-hover:animate-blink">
                CLICK TO ENTER →
              </div>
            </div>
          </RetroWindow>
        </Link>

        {/* Analyzer Card */}
        <Link href="/analyzer" className="block group">
          <RetroWindow title="🔍 ANALYZER" className="h-full hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="font-retro text-neon-cyan text-sm mb-3">ANALYZER</h3>
              <p className="font-mono text-neon-green text-xs leading-relaxed">
                Paste your conversations and get AI feedback with a retro Rizz Score meter. Know where you stand!
              </p>
              <div className="mt-4 font-mono text-neon-yellow text-xs group-hover:animate-blink">
                CLICK TO ENTER →
              </div>
            </div>
          </RetroWindow>
        </Link>

        {/* Pickup Lines Card */}
        <Link href="/pickup-lines" className="block group">
          <RetroWindow title="🎲 PICKUP LINES" className="h-full hover:scale-105 transition-transform">
            <div className="text-center">
              <div className="text-6xl mb-4">🎰</div>
              <h3 className="font-retro text-neon-magenta text-sm mb-3">PICKUP LINES</h3>
              <p className="font-mono text-neon-yellow text-xs leading-relaxed">
                Generate pickup lines by category and save your favorites. From cheesy to clever, we&apos;ve got you covered!
              </p>
              <div className="mt-4 font-mono text-neon-yellow text-xs group-hover:animate-blink">
                CLICK TO ENTER →
              </div>
            </div>
          </RetroWindow>
        </Link>
      </div>

      {/* Flame Divider */}
      <div className="text-center mb-12">
        <div className="text-4xl">🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥</div>
      </div>

      {/* Info Section */}
      <RetroWindow title="ℹ️ ABOUT THIS SITE" className="max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="border-2 border-neon-green bg-gray-900 p-4">
            <h3 className="font-mono text-neon-green text-sm mb-2">🤖 POWERED BY AI</h3>
            <p className="font-mono text-neon-cyan text-xs leading-relaxed">
              This tool uses Anthropic&apos;s Claude Sonnet 4 to generate contextually appropriate, charming messages.
              It&apos;s like having a wingman from the future... or the past... or both!
            </p>
          </div>

          <div className="border-2 border-neon-cyan bg-gray-900 p-4">
            <h3 className="font-mono text-neon-cyan text-sm mb-2">🎨 90s AESTHETIC</h3>
            <p className="font-mono text-neon-magenta text-xs leading-relaxed">
              Experience the golden age of the internet with authentic Geocities vibes, matrix rain backgrounds, 
              neon colors, and retro fonts. It&apos;s 1999 all over again!
            </p>
          </div>

          <div className="border-2 border-neon-magenta bg-gray-900 p-4">
            <h3 className="font-mono text-neon-magenta text-sm mb-2">💾 LOCAL STORAGE</h3>
            <p className="font-mono text-neon-yellow text-xs leading-relaxed">
              Save your favorite pickup lines locally in your browser. No account needed, no data sent to servers. 
              Your favorites stay on your device!
            </p>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="font-mono text-neon-green text-xs animate-blink">
            🚧 ALWAYS UNDER CONSTRUCTION 🚧
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap text-xs font-mono">
            <span className="text-neon-cyan">⭐ BEST VIEWED IN 1024x768 ⭐</span>
            <span className="text-neon-magenta">💿 OPTIMIZED FOR DIAL-UP 💿</span>
          </div>
        </div>
      </RetroWindow>

      {/* Webring Style Footer */}
      <div className="mt-12 text-center">
        <div className="inline-block border-2 border-neon-yellow bg-black px-6 py-3">
          <p className="font-mono text-neon-yellow text-xs mb-2">
            ⚡ PART OF THE RIZZ WEBRING ⚡
          </p>
          <div className="flex items-center justify-center gap-3 text-neon-cyan text-xs">
            <span>← PREV</span>
            <span>|</span>
            <span>RANDOM</span>
            <span>|</span>
            <span>NEXT →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
