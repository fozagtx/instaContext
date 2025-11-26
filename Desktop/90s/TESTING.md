# 90s AI Rizz Tool - Testing Guide

## Setup

1. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

2. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

3. Install dependencies and run:
```bash
bun install
bun dev
```

4. Open http://localhost:3000

## Manual Testing Checklist

### Landing Page
- [ ] Matrix rain animation is visible and smooth
- [ ] CRT scanline effect is subtle
- [ ] All three feature cards are clickable
- [ ] Navigation links work
- [ ] Responsive on mobile, tablet, desktop
- [ ] All 90s styling elements render correctly

### Rizz Generator (`/rizz-generator`)
- [ ] Context input accepts text
- [ ] All 5 style buttons are selectable
- [ ] Selected style highlights with neon magenta
- [ ] Chat interface displays messages
- [ ] AI generates responses when submitted
- [ ] Streaming text appears in real-time
- [ ] Copy button copies text to clipboard
- [ ] "COPIED!" animation appears
- [ ] Loading state shows blinking text
- [ ] Responsive layout works on all devices

### Conversation Analyzer (`/analyzer`)
- [ ] Textarea accepts multi-line conversation
- [ ] Analyze button triggers AI analysis
- [ ] Loading state shows during analysis
- [ ] Rizz Score meter animates from 0 to score
- [ ] Score color changes based on value (green/cyan/yellow/magenta)
- [ ] Analysis text displays properly
- [ ] Responsive two-column layout works
- [ ] Error handling works if API fails

### Pickup Line Generator (`/pickup-lines`)
- [ ] All 4 category buttons are selectable
- [ ] Selected category highlights with neon yellow
- [ ] Generate button creates new pickup lines
- [ ] Spinning dice animation shows during generation
- [ ] Generated line displays with category badge
- [ ] Copy button works on generated lines
- [ ] Save button adds to favorites
- [ ] Favorites list displays saved lines
- [ ] Remove button deletes from favorites
- [ ] Favorites persist after page refresh
- [ ] Clear all button works
- [ ] Storage limit (50) is enforced
- [ ] Duplicate detection works

### Header & Footer
- [ ] Header navigation highlights active page
- [ ] Marquee text scrolls continuously
- [ ] Footer hit counter animates on load
- [ ] All badges and decorative elements display
- [ ] Responsive navigation works on mobile

### Accessibility
- [ ] All buttons are keyboard accessible (Tab navigation)
- [ ] Focus indicators are visible
- [ ] ARIA labels are present on icon buttons
- [ ] Screen reader friendly
- [ ] Color contrast is sufficient

### Performance
- [ ] Matrix rain runs smoothly (~30fps)
- [ ] No layout shifts during load
- [ ] Animations don't cause jank
- [ ] Page loads quickly
- [ ] No memory leaks (check DevTools)

### Error Handling
- [ ] Missing API key shows helpful error
- [ ] Network errors display user-friendly messages
- [ ] Local storage unavailable is handled gracefully
- [ ] Invalid inputs are validated

## Browser Testing

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Known Limitations

- Local storage is limited to ~5-10MB per domain
- API rate limits depend on your Anthropic plan
- Matrix rain may be less smooth on older devices
- Some 90s fonts may not load on all systems

## Troubleshooting

### API Not Working
1. Check `.env.local` has correct API key
2. Verify API key is valid at https://console.anthropic.com/
3. Check browser console for errors
4. Ensure you have API credits

### Animations Laggy
1. Reduce matrix rain opacity in `MatrixRain.tsx`
2. Disable CRT effect in `layout.tsx`
3. Check browser hardware acceleration is enabled

### Local Storage Not Working
1. Check browser allows local storage
2. Clear browser cache and try again
3. Check storage quota isn't exceeded
