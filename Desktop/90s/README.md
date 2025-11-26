# 💘 90s AI Rizz Tool

A nostalgic web application that combines retro Geocities aesthetics with modern AI capabilities to help you craft charming messages for romantic situations.

## ✨ Features

- **AI Rizz Generator**: Get AI-powered message suggestions with customizable conversation styles
- **Conversation Analyzer**: Paste your conversations and get feedback with a retro "Rizz Score" meter
- **Pickup Line Generator**: Generate and save pickup lines by category
- **Authentic 90s Aesthetic**: Matrix rain backgrounds, neon colors, retro fonts, and window-style UI

## 🚀 Getting Started

**New here?** Check out the [Quick Start Guide](./QUICKSTART.md) for a 5-minute setup!

### Prerequisites

- [Bun](https://bun.sh/) installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Set up your environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19
- **Styling**: Tailwind CSS 4 with custom 90s theme
- **AI**: Anthropic Claude Sonnet 4 via Vercel AI SDK
- **Fonts**: Press Start 2P, VT323
- **Package Manager**: Bun

## 🎮 90s Features

- Matrix rain background animation
- Neon glow effects on all interactive elements
- Retro window-style containers
- Marquee scrolling text
- Fake hit counters and "Best viewed in Netscape Navigator" badges
- CRT scanline effects
- Authentic 90s color palette (neon green, cyan, magenta, yellow)

## 🧪 Testing

See [TESTING.md](./TESTING.md) for a complete testing guide and checklist.

## 🎯 Features Checklist

- ✅ AI Rizz Generator with 5 conversation styles
- ✅ Conversation Analyzer with animated Rizz Score meter
- ✅ Pickup Line Generator with 4 categories
- ✅ Local storage for saving favorites (up to 50)
- ✅ Matrix rain background animation
- ✅ CRT scanline effect
- ✅ Retro window-style UI components
- ✅ Neon glow effects and 90s color palette
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Keyboard accessible
- ✅ Real-time AI streaming responses

## 🐛 Troubleshooting

**API not working?**
- Verify your `ANTHROPIC_API_KEY` in `.env.local`
- Check you have API credits at https://console.anthropic.com/
- Look for errors in browser console (F12)

**Animations laggy?**
- The matrix rain runs at 30fps for performance
- You can disable the CRT effect in `app/layout.tsx` if needed
- Ensure browser hardware acceleration is enabled

**Local storage not saving?**
- Check your browser allows local storage
- Clear browser cache and try again
- Maximum 50 favorites can be saved

## 📝 License

MIT
