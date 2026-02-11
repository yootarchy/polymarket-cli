# 🚀 Quick Start Guide

Get up and running with Polymarket CLI in 30 seconds.

## Installation

```bash
npm install -g @polymarket/cli
```

## Basic Usage

### 1. Interactive Mode (Recommended)

Just run `poly`:

```bash
poly
```

Then follow the prompts:
1. Type your search query (e.g., "bitcoin", "trump", "AI")
2. Choose a filter with arrow keys
3. View results
4. Select action: search again, change filter, watch market, or exit

### 2. Quick Commands

**Search for markets:**
```bash
poly search "bitcoin price"
```

**See what's trending:**
```bash
poly trending
```

**See what's ending soon:**
```bash
poly ending
```

**Watch a specific market:**
```bash
poly watch <condition-id>
```

## Tips

### Keyboard Controls (Interactive Mode)
- **↑/↓** - Navigate options
- **Enter** - Select option
- **Type** - Enter search text
- **Ctrl+C** - Exit anytime

### Finding Good Markets

Start with broad searches:
- `poly` → search "bitcoin"
- `poly` → search "election"
- `poly` → search "AI"
- `poly` → search "sports"

Then use filters to narrow down:
- **Trending** - Most active markets
- **Ending Soon** - Urgent decisions
- **Long-Term** - Future predictions

### Watch Mode

When you find an interesting market:
1. Note its number in the list
2. Select "Watch a market"
3. Enter the number
4. See live updates every 30 seconds

Press Ctrl+C to exit watch mode.

## Example Session

```bash
$ poly

╔══════════════════════════════════════════╗
║   🎲 Polymarket CLI - Interactive Mode   ║
╚══════════════════════════════════════════╝

? Search markets: AI

✓ Found 15 markets matching "AI"

? Sort by: Trending (24hr volume)

📊 Trending AI Markets:

1. Will GPT-5 be released in 2026?
   YES: 42% ↑  NO: 58%
   Volume: $1.2M  Ends: Dec 31, 2026

2. AI discovers new drug by June?
   YES: 31%  NO: 69% ↑
   Volume: $890K  Ends: Jun 30, 2026

? What next: Watch a market

? Enter market number to watch: 1

📊 Polymarket Live Monitor

Will GPT-5 be released in 2026?

YES: 42.1% ↑
NO:  57.9%

24hr Volume: $1.2M
Ends: Dec 31, 2026

Updating every 30s... Press Ctrl+C to exit
```

## Need Help?

Run with `--help`:
```bash
poly --help
poly search --help
```

## Next Steps

- Read the [full README](README.md) for detailed features
- Check [EXAMPLES.md](EXAMPLES.md) for common use cases
- Report issues on GitHub

---

**Happy trading! 🎲**
