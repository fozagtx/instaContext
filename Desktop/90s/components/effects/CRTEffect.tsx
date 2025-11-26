"use client";

export function CRTEffect() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 opacity-10"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent bg-[length:100%_4px] animate-scanline" />
    </div>
  );
}
