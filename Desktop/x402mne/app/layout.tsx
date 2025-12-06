import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { EthereumProvider } from "@/components/providers/ethereum-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "x402mnee — Programmable Money for Agents, Commerce, and Automated Finance",
  description: "Build the future of digital commerce with MNEE, a USD-backed stablecoin on Ethereum. Enable AI agents to transact autonomously and smart contracts to automate financial workflows.",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <EthereumProvider>
          <Header />
          {children}
        </EthereumProvider>
      </body>
    </html>
  );
}
