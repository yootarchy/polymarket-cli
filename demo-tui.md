# Interactive TUI Mode Demo

## Quick Demo Flow

Here's what the user experience looks like:

### 1. Launch (no arguments)

```bash
$ node dist/index.js
```

Output:
```
╔══════════════════════════════════════════╗
║   🎲 Polymarket CLI - Interactive Mode   ║
╚══════════════════════════════════════════╝

Navigate with ↑↓ arrows • Press Q to quit

Welcome to Polymarket CLI Interactive Mode!

Use arrow keys to navigate, Enter to select.

? What would you like to do?
❯ 🔍 Search events by tag
  🔥 Trending markets
  ⏰ Ending soon
  🔄 Refresh cache
  ❌ Quit
```

### 2. Select "Search events by tag"

Press Enter on first option:

```
? Enter search query (tag/keyword): bitcoin█
```

### 3. View Search Results

After entering "bitcoin":

```
Found 5 events matching "bitcoin":

? Select an event to view markets:
❯ 1. Bitcoin Price Prediction 2025 (3 markets)
  2. Will Bitcoin hit $100k in 2025? (1 market)
  3. Bitcoin vs Ethereum Market Cap (2 markets)
  4. Bitcoin ETF Approval (4 markets)
  5. Bitcoin Halving Impact (2 markets)
  ← Back to search
  ← Main menu
```

### 4. Select an Event

Arrow down and press Enter:

```
╔══════════════════════════════════════════╗
║   🎲 Polymarket CLI - Interactive Mode   ║
╚══════════════════════════════════════════╝

📊 Event: Bitcoin Price Prediction 2025

Tag: bitcoin
Markets: 3

1. Will Bitcoin reach $100,000 in 2025?
   Volume: $1.2M

2. Bitcoin price above $80k by end of Q1?
   Volume: $850K

3. Bitcoin dominance above 50% in 2025?
   Volume: $420K

? Press Enter to go back...█
```

### 5. Press Enter → Back to Results

Returns to the event list, can select another or go back.

### 6. Select "← Main menu"

```
╔══════════════════════════════════════════╗
║   🎲 Polymarket CLI - Interactive Mode   ║
╚══════════════════════════════════════════╝

Navigate with ↑↓ arrows • Press Q to quit

? What would you like to do?
  🔍 Search events by tag
❯ 🔥 Trending markets
  ⏰ Ending soon
  🔄 Refresh cache
  ❌ Quit
```

### 7. Select "Trending markets"

```
Loading trending markets... ⠋
```

Then:

```
🔥 Top Trending Markets (24hr Volume):

? Select a market for details:
❯ 1. Will Trump win 2024 election? ($5.2M/24h)
  2. Bitcoin above $100k in 2025? ($2.8M/24h)
  3. AI achieves AGI by 2030? ($1.9M/24h)
  4. Recession in 2025? ($1.5M/24h)
  5. SpaceX Mars landing by 2026? ($890K/24h)
  ← Main menu
```

### 8. Select a Market

Shows detailed market info:

```
╔══════════════════════════════════════════╗
║   🎲 Polymarket CLI - Interactive Mode   ║
╚══════════════════════════════════════════╝

1. Will Trump win 2024 election?

   💰 Volume (24h): $5.2M
   📊 Total Volume: $125M
   📅 Ends: 2024-11-05
   
   YES: 52% ($0.52)
   NO:  48% ($0.48)
   
   🔗 https://polymarket.com/market/...

? Press Enter to go back...█
```

### 9. Navigate to "Ending soon"

After going back to main menu:

```
? What would you like to do?
  🔍 Search events by tag
  🔥 Trending markets
❯ ⏰ Ending soon
  🔄 Refresh cache
  ❌ Quit
```

Shows:

```
⏰ Markets Ending Soon (Next 7 Days):

? Select a market for details:
❯ 1. Super Bowl 2025 Winner (Ends: 2025-02-09)
  2. January Jobs Report Positive? (Ends: 2025-02-07)
  3. Bitcoin above $95k this week? (Ends: 2025-02-14)
  ← Main menu
```

### 10. Refresh Cache

```
? What would you like to do?
  🔍 Search events by tag
  🔥 Trending markets
  ⏰ Ending soon
❯ 🔄 Refresh cache
  ❌ Quit
```

Shows:

```
🔄 Refreshing event cache...
This will take ~30 seconds.

⠋ Fetching events from Polymarket API...
```

Then:

```
✔ Cache refreshed successfully!

✓ Cached 1,247 events
  Last updated: 2/11/2025, 8:15:23 PM

? Press Enter to continue...█
```

### 11. Quit

```
? What would you like to do?
  🔍 Search events by tag
  🔥 Trending markets
  ⏰ Ending soon
  🔄 Refresh cache
❯ ❌ Quit
```

Output:

```
👋 Thanks for using Polymarket CLI!

$
```

## Key UX Features Demonstrated

### ✅ Persistent Session
- Started once, used for multiple operations
- No need to re-run command
- Only exits when user chooses "Quit"

### ✅ Arrow Key Navigation
- All menus navigable with ↑↓
- Visual cursor (❯) shows selection
- Enter to confirm

### ✅ Context-Aware Back Options
- Every sub-menu has "← Back" or "← Main menu"
- Can navigate up the hierarchy
- Never stuck in a view

### ✅ Clean Transitions
- Screen clears between major transitions
- Consistent header maintained
- Smooth flow

### ✅ Helpful Feedback
- Loading spinners for API calls
- Success/error messages
- Clear prompts
- Volume/date information displayed

### ✅ Flexible Navigation
- Can search → view → back → trending → back → search again
- Free exploration without friction
- Natural workflow

## Comparison to Command Mode

### Command Mode (one-and-done)
```bash
$ node dist/index.js search bitcoin
[results]
$ node dist/index.js trending
[results]
$ node dist/index.js search ethereum
[results]
```
👎 Repetitive, requires typing commands each time

### Interactive Mode (persistent)
```bash
$ node dist/index.js
[menu] → search "bitcoin" → [results] → 
[menu] → trending → [results] →
[menu] → search "ethereum" → [results] →
[menu] → quit
```
👍 Smooth, one session, arrow key navigation

---

**Try it yourself:** `node dist/index.js` (no arguments needed!)
