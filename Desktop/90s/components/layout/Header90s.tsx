"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header90s() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/rizz-generator", label: "RIZZ GENERATOR" },
    { href: "/analyzer", label: "ANALYZER" },
    { href: "/pickup-lines", label: "PICKUP LINES" },
  ];

  return (
    <header className="relative z-10 border-b-4 border-neon-cyan bg-black">
      {/* Marquee */}
      <div className="overflow-hidden bg-neon-magenta py-1">
        <div className="animate-marquee whitespace-nowrap text-black font-mono text-sm font-bold">
          ✨ WELCOME TO THE ULTIMATE RIZZ ZONE ✨ GET YOUR GAME UP ✨ POWERED BY AI ✨ 90s VIBES ONLY ✨
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-retro text-xl text-neon-green hover:text-neon-cyan transition-colors">
            💘 90s RIZZ TOOL
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-2 font-mono text-sm border-2 transition-all
                  ${
                    pathname === link.href
                      ? "bg-neon-cyan text-black border-neon-cyan shadow-neon-strong"
                      : "text-neon-cyan border-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-neon"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
