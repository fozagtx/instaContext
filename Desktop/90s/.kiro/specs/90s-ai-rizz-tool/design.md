# Design Document

## Overview

The 90s AI Rizz Tool is a Next.js 14+ application that combines nostalgic 90s web aesthetics with modern AI capabilities. The application uses the App Router architecture, Tailwind CSS 4 for styling, and integrates with Anthropic's Claude Sonnet 4 via the Vercel AI SDK. The design emphasizes authentic retro styling while maintaining modern performance standards and accessibility.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │     Rizz     │  │  Conversation│      │
│  │     Page     │  │  Generator   │  │   Analyzer   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  Pickup Lines   │                        │
│                   │   Generator     │                        │
│                   └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/Streaming
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              /api/chat Route Handler                  │   │
│  │  - Request validation                                 │   │
│  │  - System prompt construction                         │   │
│  │  - Claude API integration                             │   │
│  │  - Response streaming                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Anthropic Claude Sonnet 4 API                 │   │
│  │  - Text generation                                    │   │
│  │  - Conversation analysis                              │   │
│  │  - Style-aware responses                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 16.0.4 with App Router
- **Runtime**: React 19.2.0
- **Styling**: Tailwind CSS 4 with custom 90s theme
- **AI Integration**: Vercel AI SDK (`ai` package) + `@ai-sdk/anthropic`
- **State Management**: React hooks (useState, useEffect, useRef)
- **Storage**: Browser LocalStorage API
- **Fonts**: Google Fonts (Press Start 2P, VT323)
- **TypeScript**: Type-safe development

### Project Structure

```
90sgpt/
├── app/
│   ├── layout.tsx                    # Root layout with 90s fonts
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # 90s theme + animations
│   ├── rizz-generator/
│   │   └── page.tsx                  # AI Rizz Generator feature
│   ├── analyzer/
│   │   └── page.tsx                  # Conversation Analyzer feature
│   ├── pickup-lines/
│   │   └── page.tsx                  # Pickup Line Generator feature
│   └── api/
│       └── chat/
│           └── route.ts              # Claude API endpoint
├── components/
│   ├── layout/
│   │   ├── Header90s.tsx             # Retro header with navigation
│   │   └── Footer90s.tsx             # Footer with 90s badges
│   ├── ui/
│   │   ├── RetroWindow.tsx           # Window-style container
│   │   ├── NeonButton.tsx            # Neon-styled button
│   │   ├── BlinkingText.tsx          # Animated blinking text
│   │   ├── CopyButton.tsx            # Copy with animation
│   │   └── RizzScoreMeter.tsx        # Animated gauge
│   ├── effects/
│   │   ├── MatrixRain.tsx            # Canvas-based background
│   │   └── CRTEffect.tsx             # Optional scanline overlay
│   └── features/
│       ├── StyleSelector.tsx         # Conversation style picker
│       ├── CategoryFilter.tsx        # Pickup line categories
│       └── FavoritesList.tsx         # Saved favorites display
├── lib/
│   ├── claude.ts                     # AI SDK configuration
│   ├── prompts.ts                    # System prompt templates
│   └── storage.ts                    # LocalStorage utilities
├── types/
│   ├── chat.ts                       # Chat message types
│   └── pickupLines.ts                # Pickup line types
└── public/
    ├── gifs/                         # 90s animated GIFs
    └── icons/                        # Pixelated icons
```

## Components and Interfaces

### Core Components

#### 1. RetroWindow Component

**Purpose**: Provides the signature 90s window aesthetic with title bar and beveled borders.

**Props Interface**:
```typescript
interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}
```

**Styling Features**:
- 4px neon cyan border with glow effect
- Gradient title bar (cyan to magenta)
- Minimize/maximize/close buttons (decorative)
- Inner padding with black background

#### 2. NeonButton Component

**Purpose**: Interactive button with neon glow hover effects.

**Props Interface**:
```typescript
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'cyan' | 'magenta' | 'yellow';
  glowIntensity?: 'normal' | 'strong';
}
```

**States**:
- Default: Border with subtle glow
- Hover: Background fill + strong glow
- Active: Scale down (0.95)
- Disabled: 50% opacity

#### 3. MatrixRain Component

**Purpose**: Animated background effect using HTML5 Canvas.

**Implementation Details**:
- Canvas fills viewport (fixed position)
- 20% opacity to avoid overwhelming content
- Green (#00FF00) characters falling
- Characters: A-Z, 0-9, symbols
- 14px font size, ~60 columns
- 33ms interval (~30fps) for performance
- Cleanup on unmount
