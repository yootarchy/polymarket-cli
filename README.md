# 🎲 Polymarket CLI

> **Learn by example:** A production-ready TypeScript CLI demonstrating modern terminal UI patterns, intelligent caching strategies, and API integration you can study and adapt.

Browse 5,000+ Polymarket prediction markets from your terminal with tag-based search, live odds tracking, and offline-capable local caching.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D16.0.0-green)](https://nodejs.org/)

---

## 🎓 Why This CLI Exists

Building developer tools? This project shows you how.

**What you'll learn:**
- ✅ **Interactive TUI patterns** with Inquirer.js and state management
- ✅ **Offline-first architecture** using local cache with smart invalidation
- ✅ **Clean API client design** with proper error handling and rate limiting
- ✅ **TypeScript project structure** that scales from prototype to production
- ✅ **CLI UX best practices** - from one-shot commands to watch modes

**Perfect for:**
- DevRel engineers building reference implementations
- Developers learning modern Node.js CLI architecture
- Anyone who needs a production-ready TypeScript CLI starter

---

## ✨ What It Does

- 🎯 **Interactive Terminal UI** - Stay-open interface with keyboard navigation (not just fire-and-forget commands)
- 🔍 **Tag-Based Event Search** - Find events by keyword using local cache (politics, crypto, sports, etc.)
- ⚡ **Offline Capable** - Search 5,000+ active events instantly without API calls
- 🔄 **Smart Cache Management** - Auto-refresh with stale detection and manual refresh command
- 📊 **Live Market Monitoring** - Real-time odds, volume, and trend indicators with auto-refresh
- 🎨 **Beautiful Terminal Output** - Color-coded results with trend arrows and table formatting

---

## 🚀 Quick Start

### Try it now (no install):

```bash
npx @polymarket/cli
```

**Interactive mode starts immediately** - use arrow keys to navigate, search markets, and filter by trending/ending soon/long-term.

### Install globally:

```bash
npm install -g @polymarket/cli
poly
```

### Build from source (recommended for learning):

```bash
git clone https://github.com/yootarchy/polymarket-cli.git
cd polymarket-cli
npm install
npm run build
npm link
```

**Then dive into the code** - all commands live in `src/commands/`, the interactive flow is in `src/interactive.ts`, and cache logic is in `src/cache.ts`.

---

## 🏗️ Architecture & Learning Resources

### How It's Built

This CLI demonstrates **three key architectural patterns** you can reuse:

#### 1. **Interactive TUI Flow** (`src/interactive.ts`)
- State machine pattern for multi-step workflows
- Clean prompt composition with Inquirer.js
- Loop-based interface that doesn't exit after each action

#### 2. **Offline-First Caching** (`src/cache.ts`)
- Local JSON cache at `~/.polymarket-cli/events-cache.json`
- Stale detection with 24-hour threshold
- Smart refresh prompts and manual refresh command
- Tag indexing for instant keyword search

#### 3. **Modular Command Structure** (`src/commands/`)
- Each command is a standalone function
- Shared formatters in `src/formatters.ts`
- Unified API client in `src/api.ts` with retry logic

### Project Structure

```
polymarket-cli/
├── src/
│   ├── index.ts           # Entry point & CLI router (Commander.js)
│   ├── interactive.ts     # Interactive TUI loop (Inquirer.js)
│   ├── api.ts            # Polymarket Gamma API client with error handling
│   ├── cache.ts          # Local cache manager with stale detection
│   ├── formatters.ts     # Terminal output helpers (Chalk + tables)
│   └── commands/
│       ├── search.ts     # Offline search against local cache
│       ├── refresh.ts    # Fetch + rebuild cache from API
│       ├── trending.ts   # Sort by 24hr volume
│       ├── ending.ts     # Filter by end date (<7 days)
│       └── watch.ts      # Live monitoring with setInterval
├── dist/                  # Compiled JS (npm publishes this)
├── package.json          # Bin entry: "poly" → dist/index.js
└── tsconfig.json         # Target: ES2020, module: CommonJS
```

**Study these files if you're building:**
- 📖 `src/interactive.ts` - Learn interactive prompt flows
- 📖 `src/cache.ts` - Learn offline-first data management
- 📖 `src/api.ts` - Learn API client patterns with Axios
- 📖 `src/commands/watch.ts` - Learn real-time terminal updates

See **[CACHE-ARCHITECTURE.md](./CACHE-ARCHITECTURE.md)** for deep dive on the caching system.

---

## 📋 Command Reference

### Interactive Mode (Recommended for First-Time Users)

```bash
poly
```

**Flow:**
1. Enter search term (e.g. "bitcoin", "politics")
2. Choose filter (trending / ending soon / long-term / all)
3. View results with live odds
4. Loop: new search, change filter, watch market, or exit

**Key controls:**
- Arrow keys = navigate
- Enter = select
- Ctrl+C = exit

---

### One-Shot Commands (Perfect for Scripting)

#### Search (Offline, Cache-Based)
```bash
poly search bitcoin
poly search politics
```
- ⚡ **Instant** - no API calls, searches local cache
- 🔌 **Offline capable** after first cache build
- 📊 Returns: event titles, market counts, tags

**First-time use:** Auto-builds cache (~30 seconds)
**Subsequent searches:** <10ms

---

#### Refresh Cache
```bash
poly refresh
```
- Fetches latest 5,000 active events from Polymarket API
- Updates local cache with new tags and market data
- Takes ~30 seconds, provides progress feedback
- Recommended: run once per day

---

#### Trending Markets
```bash
poly trending
```
- Fetches top markets by 24hr volume
- Shows: odds, volume, end date, tags
- Updates: live data from API (not cached)

---

#### Ending Soon
```bash
poly ending
```
- Markets ending within 7 days
- Sorted by end date (soonest first)

---

#### Watch Mode (Live Monitoring)
```bash
poly watch <condition-id>
```
- Auto-refreshes every 30 seconds
- Shows: live odds, volume, end date
- Press Ctrl+C to exit

---

## 📊 Performance Stats

| Metric | Value | Notes |
|--------|-------|-------|
| **Search Speed** | <10ms | Cache-based, no network |
| **Cache Refresh** | ~30s | Fetches 5,000 events |
| **Cache Size** | 3.7 MB | JSON file in home directory |
| **Memory Usage** | <50 MB | Lightweight, CLI-friendly |
| **Startup Time** | <1s | Compiled TypeScript |

---

## 🎯 Use Cases

### 1. **Learning Modern CLI Development**
- Study the code to understand TUI patterns
- Reference the cache architecture for offline-first apps
- Learn TypeScript project setup for Node.js CLIs

### 2. **Building Developer Tools**
- Use as a starter template for your own CLI
- Adapt the cache system for other APIs
- Learn from the UX patterns (interactive vs one-shot)

### 3. **Terminal-Based Workflows**
- Quick market research without opening browser
- Scriptable commands for automation
- Offline browsing with occasional cache refresh

### 4. **Teaching & Documentation**
- Show this to junior devs learning Node.js
- Reference implementation for DevRel talks
- Example of production-ready open-source code

---

## 🛠️ Development Guide

### Setup

```bash
git clone https://github.com/yootarchy/polymarket-cli.git
cd polymarket-cli
npm install
```

### Build & Run

```bash
# Compile TypeScript
npm run build

# Run compiled version
npm start

# Development mode (tsx)
npm run dev

# Link locally for testing
npm link
poly
```

### Demo Commands (No Build Required)

```bash
npm run demo:search   # Tests search command
npm run demo:trending # Tests trending command
```

### Tech Stack Choices

| Library | Why? | Alternative |
|---------|------|-------------|
| **TypeScript 5.7** | Type safety, modern syntax | Plain JavaScript |
| **Inquirer.js** | Best-in-class interactive prompts | Prompts, Enquirer |
| **Commander** | Standard CLI arg parsing | Yargs, Meow |
| **Chalk** | Terminal colors, widely used | Kleur, Picocolors |
| **Axios** | HTTP client with interceptors | node-fetch, got |
| **Ora** | Spinners for loading states | CLI-Spinner |

**Why these specific choices?**
- Inquirer.js = battle-tested for complex TUI flows
- Commander = minimal API, easy to learn
- Chalk = most popular coloring library, good DX
- Axios = built-in retry logic and interceptors
- TypeScript = type safety prevents runtime errors in production

---

## 🤝 Contributing

**Contributions welcome!** This is a learning-focused project - improvements to documentation, code clarity, and examples are especially valued.

### How to Contribute

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes (prioritize readability for learners)
4. Add tests if applicable
5. Update documentation if you change behavior
6. Commit: `git commit -m 'Add your feature'`
7. Push: `git push origin feature/your-feature`
8. Open a Pull Request with:
   - What you changed
   - Why (especially if it improves the learning value)
   - Screenshots/examples if relevant

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 🧠 Learning Resources

**Want to build your own CLI like this?**

- 📖 [How to Build a Node.js CLI](https://nodejs.org/en/learn/command-line/cli-commands) - Official Node.js guide
- 📖 [Inquirer.js Examples](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples) - Interactive prompt patterns
- 📖 [Commander.js Documentation](https://github.com/tj/commander.js#readme) - CLI argument parsing
- 📖 [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system fundamentals

**Related projects to study:**
- [npm CLI](https://github.com/npm/cli) - Production-scale CLI architecture
- [GitHub CLI](https://github.com/cli/cli) - Go-based CLI with great UX
- [Heroku CLI](https://github.com/heroku/cli) - Plugin-based architecture

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

**TL;DR:** Do whatever you want with this code. Build on it, fork it, use it in commercial projects, adapt it for your own CLIs. No attribution required (but appreciated!).

---

## 🙏 Credits

- **Data source:** [Polymarket](https://polymarket.com) - world's largest prediction market
- **API:** [Polymarket Gamma API](https://docs.polymarket.com) - public, no auth required
- **Inspiration:** The need for terminal-native developer tools and reference implementations
- **Built by:** [@yootarchy](https://github.com/yootarchy) as a DevRel learning resource

---

## ⚠️ Disclaimer

**This is an unofficial tool** and is not affiliated with, endorsed by, or connected to Polymarket in any way.

- Use at your own risk
- Always verify market data on official Polymarket website before trading
- This is a learning resource, not financial advice
- API endpoints may change without notice

---

## 📞 Support & Contact

- 🐛 **Issues:** [GitHub Issues](https://github.com/yootarchy/polymarket-cli/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yootarchy/polymarket-cli/discussions)
- 🐦 **Twitter:** [@yootarchy](https://twitter.com/yootarchy)

---

**⭐ Star this repo if you find it useful!**

*Made with ❤️ for developers learning by example*
