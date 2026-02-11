# 🎬 Demo Guide

Quick demonstrations to show off Polymarket CLI's capabilities.

## Demo 1: Interactive Mode (2 minutes)

**What to show**: The complete interactive experience

```bash
poly
```

**Script:**
1. "Let me show you the new interactive mode..."
2. Type "bitcoin" in search
3. Arrow down to "Ending Soon" filter
4. Press Enter to see markets closing soon
5. Select "Change filter"
6. Arrow to "Trending"
7. Show the different results
8. Select "Watch a market" 
9. Enter "1" to watch first market
10. Let it update once, then Ctrl+C
11. Select "Exit"

**Talking points:**
- "Notice it stays open - no need to restart"
- "All keyboard navigation - very fast"
- "Clean, professional interface"
- "Easy to explore and refine your search"

## Demo 2: One-Shot Commands (30 seconds)

**What to show**: Classic CLI usage for scripting

```bash
# Quick search
poly search "trump 2026"

# See what's trending
poly trending

# Check ending soon
poly ending
```

**Talking points:**
- "Still supports quick one-off commands"
- "Perfect for scripting and automation"
- "Same great formatting"

## Demo 3: Watch Mode (1 minute)

**What to show**: Live market monitoring

```bash
# From interactive mode, watch a market
# OR use direct command:
poly watch <condition-id>
```

**Talking points:**
- "Updates every 30 seconds"
- "See price movements in real-time"
- "Track volume and time remaining"
- "Great for active trading"

## Demo 4: Workflow Demo (3 minutes)

**What to show**: Real-world usage pattern

**Scenario**: "Let me check crypto markets this morning..."

```bash
poly
```

**Actions:**
1. Search "crypto"
2. Filter: Trending
3. Browse top results
4. "Interesting, let me check politics too..."
5. Select "New search"
6. Search "election"
7. Filter: Ending Soon
8. "These need decisions soon!"
9. Select "Watch a market"
10. Watch for 30 seconds
11. Ctrl+C to return
12. Exit

**Talking points:**
- "Natural workflow - search, filter, explore"
- "Easy to jump between topics"
- "Deep dive when something catches your eye"
- "This is what makes it useful for daily use"

## Quick Feature Highlights

### Speed Comparison

**Old way** (traditional CLI):
```bash
poly search bitcoin
# Look at results, want different filter
poly search bitcoin | grep "Ending"
# Not quite right...
# Have to restart and remember what you saw
```

**New way** (interactive):
```bash
poly
# Search "bitcoin"
# Try different filters instantly
# Results stay on screen
# Easy to compare and explore
```

### For Different Users

**Traders:**
```bash
poly
# Search "your-interest" → Filter: Trending
# Quick daily check-in
```

**Researchers:**
```bash
poly
# Deep dive with multiple searches
# Switch filters to see different angles
# Watch interesting markets
```

**Scripters:**
```bash
poly trending | grep Volume
# Traditional one-shot commands still work
```

## Impressive Features to Highlight

1. **Stays Open** - "No more typing 'poly' 20 times a day"
2. **Keyboard Only** - "Mouse-free, super fast"
3. **Smooth UX** - "Clean transitions, no flicker"
4. **Flexible** - "Interactive when exploring, one-shot when scripting"
5. **Professional** - "Polished UI, helpful hints"

## Common Questions

**Q: What if I just want one quick search?**
A: Use `poly search "query"` - works exactly like before!

**Q: Can I script it?**
A: Yes! All one-shot commands work perfectly in scripts.

**Q: How do I exit?**
A: Ctrl+C anytime, or select "Exit" from menu.

**Q: Does it work over SSH?**
A: Yes! Fully terminal-based, works anywhere.

**Q: Can I watch multiple markets?**
A: One at a time in watch mode. Use splits/tabs for multiple.

## Tips for a Great Demo

### Before You Start
- Have terminal ready
- Clear screen (`clear`)
- Good font size for visibility
- Think of an interesting search topic

### During Demo
- **Talk while you type** - Explain what you're doing
- **Show variety** - Different searches and filters
- **Highlight smooth UX** - Point out the flow
- **Use Ctrl+C** - Show it's safe and easy
- **Compare to old way** - Show the improvement

### Topics That Demo Well
- "bitcoin" - Usually lots of results
- "trump" - High volume markets
- "AI" - Mix of timeframes
- "election" - Time-sensitive markets
- "sports" - Relatable for everyone

### What to Avoid
- Very niche searches (might have no results)
- Super long searches (keep it punchy)
- Waiting too long in watch mode (30 sec max)
- Too many filter changes (gets repetitive)

## One-Liner Pitch

> "Polymarket CLI v2: Interactive terminal UI for prediction markets. Search, filter, watch - all without leaving your keyboard. Stays open so you can explore, but still supports one-shot commands for scripting."

## Conclusion Points

- "This is v2.0 - complete UX redesign"
- "100% backward compatible - nothing breaks"
- "Interactive by default, scriptable when needed"
- "Built for people who live in the terminal"
- "Open source, easy to contribute"

---

**Remember**: The best demo is watching someone's face when they realize they can just keep using it without restarting. That's the magic moment! ✨
