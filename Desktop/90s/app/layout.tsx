import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { MatrixRain } from "@/components/effects/MatrixRain";
import { CRTEffect } from "@/components/effects/CRTEffect";
import { Header90s } from "@/components/layout/Header90s";
import { Footer90s } from "@/components/layout/Footer90s";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-retro",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "90s AI Rizz Tool 💘",
  description: "Get your rizz game up with AI-powered 90s vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} antialiased bg-black text-neon-green`}
      >
        <MatrixRain />
        <CRTEffect />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header90s />
          <main className="flex-1">
            {children}
          </main>
          <Footer90s />
        </div>
      </body>
    </html>
  );
}
