# 🚀 Quick Start Guide

Get your 90s AI Rizz Tool up and running in 5 minutes!

## Step 1: Get an API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy it (you'll need it in Step 3)

## Step 2: Install Dependencies

```bash
bun install
```

## Step 3: Configure Environment

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your API key
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Step 4: Run the App

```bash
bun dev
```

## Step 5: Open in Browser

Navigate to http://localhost:3000

You should see the rad 90s landing page with matrix rain! 🎉

## What to Try First

### 1. Rizz Generator
- Click "RIZZ GENERATOR" from the home page
- Enter a situation like "first date tomorrow"
- Select a style (try "smooth" or "funny")
- Type "give me a message to send" and hit enter
- Watch the AI generate suggestions in real-time!
- Click COPY to copy any suggestion

### 2. Conversation Analyzer
- Click "ANALYZER" from the home page
- Paste a conversation (or make one up)
- Click "ANALYZE RIZZ"
- Watch your Rizz Score animate!
- Read the AI's feedback

### 3. Pickup Line Generator
- Click "PICKUP LINES" from the home page
- Select a category (cheesy, clever, wholesome, or nerdy)
- Click "🎰 GENERATE LINE"
- Watch the dice spin!
- Save your favorites with the 💾 SAVE button
- Your favorites persist in local storage

## Tips

- **Be specific** in your context for better AI suggestions
- **Try different styles** to find what works for you
- **Save your favorites** - they're stored locally in your browser
- **Enjoy the 90s vibes** - it's all about the aesthetic! 🔥

## Troubleshooting

### "API Error" or "Failed to process request"
- Double-check your API key in `.env.local`
- Make sure you have API credits
- Restart the dev server (`Ctrl+C` then `bun dev`)

### Matrix rain is laggy
- This is normal on older devices
- The animation runs at 30fps for performance
- You can disable it by commenting out `<MatrixRain />` in `app/layout.tsx`

### Favorites not saving
- Make sure your browser allows local storage
- Check you haven't hit the 50 favorite limit
- Try clearing your browser cache

## Next Steps

- Read the full [README.md](./README.md) for more details
- Check out [TESTING.md](./TESTING.md) for testing guidelines
- Customize the 90s theme in `tailwind.config.ts` and `app/globals.css`
- Add your own features!

## Need Help?

- Check the browser console (F12) for error messages
- Verify your API key is valid at https://console.anthropic.com/
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)

Happy rizzing! 💘✨
