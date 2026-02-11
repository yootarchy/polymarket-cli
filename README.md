# 🎲 Polymarket CLI

> Interactive Terminal UI for browsing Polymarket prediction markets. Tag-based search, live odds, and offline caching for 5,000+ active events.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D16.0.0-green)](https://nodejs.org/)

## ✨ Features

- 🎯 **Interactive TUI** - Stay-open terminal interface with keyboard navigation
- 🔍 **Tag-Based Search** - Find events by tag/keyword using local cache
- ⚡ **Offline Capable** - Search 5,000+ active events instantly without API calls
- 🔄 **Smart Caching** - Auto-refresh cache with latest events from Polymarket API
- 📊 **Live Market Data** - Real-time odds, volume, and trending markets
- 🎨 **Beautiful Output** - Color-coded results with trend indicators

## 📦 Installation

### Global Install (Recommended)

```bash
npm install -g @polymarket/cli
```

### Use with npx

```bash
npx @polymarket/cli
```

### From Source

```bash
git clone https://github.com/yootarchy/polymarket-cli.git
cd polymarket-cli
npm install
npm run build
npm link
```

## 🚀 Quick Start

### Interactive Mode (Default)

Simply run `poly` with no arguments to start the interactive TUI:

```bash
poly
```

**Interactive Flow:**

```
╔══════════════════════════════════════════╗
║   🎲 Polymarket CLI - Interactive Mode   ║
╚══════════════════════════════════════════╝

? Search markets: bitcoin

✓ Found 8 markets matching "bitcoin"

? Sort by: (Use arrow keys)
❯ Trending (24hr volume)
  Ending Soon (<7 days)
  Long-Term (>30 days)
  All Markets

📊 Trending Bitcoin Markets:

1. Will Bitcoin reach $150K in 2026?
   YES: 52% ↑  NO: 48%
   Volume: $2.4M  Ends: Dec 31, 2026
   
2. Bitcoin vs Ethereum 2026
   YES: 68% ↑  NO: 32%
   Volume: $892K  Ends: Dec 31, 2026

? What next: (Use arrow keys)
❯ New search
  Change filter
  Watch a market
  Exit
```

**Key Controls:**
- **Arrow Keys** - Navigate options
- **Enter** - Select
- **Ctrl+C** - Exit anytime

### One-Shot Commands

Perfect for scripting or quick lookups:

#### Search Events (Local Cache)
```bash
# Search for events by tag/keyword
poly search bitcoin
poly search politics
poly search crypto

# First-time use auto-builds cache
# Subsequent searches are instant!
```

**Example Output:**
```
Found 49 events matching tag "bitcoin":
1. MicroStrategy sells any Bitcoin by ___ ? (4 active markets)
2. When will Bitcoin hit $150k? (5 active markets)
3. Will knots flip bitcoin core by ___? (2 active markets)
...

Cache last updated: 2/11/2026, 7:58:09 PM
Run "poly refresh" to update cache with latest events.
```

#### Refresh Cache
```bash
# Update cache with latest events from API
poly refresh
```

**Example Output:**
```
🔄 Refreshing events cache from Polymarket API...

✓ Cache refreshed successfully!

📊 Cache Statistics:
  • 5,000 active events
  • 39,845 total markets
  • 976 unique tags
```

#### View Trending Markets
```bash
poly trending
```

**Output:**
```
🔥 Top Trending Markets (24hr Volume):

1. US strikes Iran by February 10, 2026?
   YES: 0.0%   NO: 100.0% ↑
   Tags: Geopolitics, Politics, Middle East
   Volume: $9.25M  Ends: Ended
   
2. Will Trump nominate Judy Shelton as the next Fed chair?
   YES: 3.8%   NO: 96.3% ↑
   Tags: Jerome Powell, Politics, Trump Presidency
   Volume: $4.62M  Ends: Dec 31, 2026
```

#### View Ending Soon
```bash
poly ending
```

#### Watch a Market (Live Updates)
```bash
poly watch <condition-id>
```

## 📊 Command Reference

| Command | Description | Speed | API Calls |
|---------|-------------|-------|-----------|
| `poly` | Interactive mode | Fast | Multiple |
| `poly search <query>` | Search events (cache) | ⚡ Instant | 0 |
| `poly refresh` | Update cache | Slow (~30s) | ~10 |
| `poly trending` | Trending markets | Fast | Multiple |
| `poly ending` | Ending soon | Fast | Multiple |
| `poly watch <id>` | Live monitor | Live | Continuous |

## 🎨 Interactive Mode Features

### 1. Search & Filter Workflow

```
Search → Filter → View Results → Action
                                   ↓
                              Loop or Exit
```

**Filters Available:**
- **Trending** - Highest 24hr trading volume
- **Ending Soon** - Markets closing within 7 days
- **Long-Term** - Markets ending in 30+ days
- **All Markets** - Unfiltered results

### 2. Actions Menu

After viewing results, choose what to do next:

- **New Search** - Start a fresh search
- **Change Filter** - Apply different filter to current results
- **Watch a Market** - Enter live monitoring mode
- **Exit** - Close the app

### 3. Live Watch Mode

Monitor specific markets with automatic updates every 30 seconds:

```bash
📊 Polymarket Live Monitor

Will Bitcoin reach $150K in 2026?

YES: 52.3% ↑
NO:  47.7% ↓

24hr Volume: $2.4M
Ends: Dec 31, 2026

Updating every 30s... Press Ctrl+C to exit
```

## 🏗️ Architecture

### Project Structure

```
polymarket-cli/
├── src/
│   ├── index.ts           # Entry point & command router
│   ├── interactive.ts     # Interactive TUI mode
│   ├── api.ts            # Polymarket API client
│   ├── cache.ts          # Local cache manager
│   ├── formatters.ts     # Display formatters
│   └── commands/
│       ├── search.ts     # Search command (cache-based)
│       ├── refresh.ts    # Cache refresh command
│       ├── trending.ts   # Trending command
│       ├── ending.ts     # Ending soon command
│       └── watch.ts      # Watch mode command
├── dist/                  # Compiled JavaScript
├── screenshots/           # Example outputs
├── package.json
├── tsconfig.json
└── README.md
```

### Cache System

The CLI uses a **local cache system** for fast, offline-capable event discovery:

- **Location:** `~/.polymarket-cli/events-cache.json`
- **Size:** ~3.7 MB (5,000 events)
- **Contains:** Active events + tags + market counts
- **Benefits:** 
  - ⚡ Instant search (no API calls)
  - 🔌 Works offline after initial cache
  - 🎯 Only active markets (no ended events)
  - 🏷️ Tag-based discovery

**Cache Workflow:**

1. **First Run** - Auto-builds cache from API (~30 seconds)
2. **Search** - Instant tag/keyword lookups against local cache
3. **Refresh** - Manual update with `poly refresh` command
4. **Auto-Update** - Prompts when cache is >24 hours old

See [CACHE-ARCHITECTURE.md](./CACHE-ARCHITECTURE.md) for detailed documentation.

### API Integration

Uses the official **Polymarket Gamma API**:

- **Base URL:** `https://gamma-api.polymarket.com`
- **Documentation:** [docs.polymarket.com](https://docs.polymarket.com)
- **Endpoints Used:**
  - `/events` - List active events
  - `/markets` - Get market details
  - `/markets/{id}` - Individual market data

## 🛠️ Development

### Setup

```bash
git clone https://github.com/yootarchy/polymarket-cli.git
cd polymarket-cli
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev           # Run with tsx (TypeScript)
npm run demo:search   # Test search command
npm run demo:trending # Test trending command
```

### Tech Stack

- **TypeScript 5.7** - Type-safe development
- **Inquirer.js** - Interactive CLI prompts
- **Chalk** - Terminal colors and styling
- **Axios** - HTTP client for API calls
- **Commander** - CLI argument parsing
- **date-fns** - Date formatting
- **Ora** - Loading spinners

## 🎯 Use Cases

### For Traders
- Quick market research via cache search
- Monitor specific markets in real-time
- Track trending predictions
- Daily cache refresh for up-to-date events

### For Developers
- CLI scripting and automation
- Fast offline lookups
- Market data integration
- Terminal-based workflows

### For Enthusiasts
- Explore prediction markets by tag
- Stay informed on events
- Fast lookups without browser
- Offline-capable after initial setup

## 📈 Performance

- **Search:** <10ms (cache-based)
- **Cache Refresh:** ~30 seconds (5,000 events)
- **Cache Size:** ~3.7 MB
- **Memory Usage:** <50 MB
- **Startup Time:** <1 second

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Credits

- Built with data from [Polymarket](https://polymarket.com) - the world's largest prediction market
- Inspired by the need for terminal-native market research tools
- Made with ❤️ by the [yootarchy](https://github.com/yootarchy) team

## ⚠️ Disclaimer

This is an **unofficial** tool and is not affiliated with, endorsed by, or connected to Polymarket in any way. Use at your own risk. Always verify market data on the official Polymarket website before making trading decisions.

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yootarchy/polymarket-cli/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yootarchy/polymarket-cli/discussions)
- **Twitter:** [@yootarchy](https://twitter.com/yootarchy)

---

**Made with ❤️ for the prediction market community**

*Star ⭐ this repo if you find it useful!*
