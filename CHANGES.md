# Polymarket CLI - Filter Behavior Fix

## Problem Fixed
The CLI was filtering too aggressively compared to the web UI:
- **Before**: Search "bitcoin" → 14 results (only showing active/open markets)
- **After**: Search "bitcoin" → 25+ results (showing all markets like web UI)

## Changes Made

### 1. Removed `closed=false` Filter from API (`src/api.ts`)

**searchMarkets():**
- Now fetches ALL markets by default (no `closed` filter)
- Fetches 2000 markets (4 pages) for better coverage
- Added `activeOnly` parameter (default: false) to optionally filter to active markets only
- Matches web UI behavior of showing everything

**getTrendingMarkets():**
- Removed `closed=false` filter
- Now sorts ALL markets by volume (not just active ones)

**getEndingSoonMarkets():**
- Removed `closed=false` filter
- Filters ALL markets by end date timeframe

### 2. Updated Filter Options (`src/interactive.ts`)

**New filter order and descriptions:**
1. **"All Markets"** (default) - Show everything, matching web UI
2. **"Active Only"** - NEW filter to show only tradeable markets
3. **"Trending"** - Sort all markets by 24hr volume
4. **"Ending Soon"** - Filter all markets ending <7 days
5. **"Long-Term"** - Filter all markets ending >30 days

**Changed default:**
- Was: `'trending'` (active markets sorted by volume)
- Now: `'all'` (show all markets, matching web UI)

**Filter logic updates:**
- `'all'` - Returns all markets unfiltered
- `'active'` - NEW, filters to only tradeable markets
- `'trending'`, `'ending'`, `'long-term'` - Work on ALL markets, not just active

### 3. Simplified Search Flow

**Removed complexity:**
- Deleted `includeInactive` parameter toggling
- Deleted `showingAllMarkets` state tracking
- Search always fetches all markets
- Filters handle the rest client-side

## Testing

```bash
# Build
npm run build

# Test search - should show all markets including ended
npm run dev -- search bitcoin

# Test interactive mode - default filter is now "All Markets"
npm run dev
```

## Behavior Comparison

### Before (with closed=false filter):
- Search "bitcoin" → 14 results (only active)
- Default filter: "Trending" (active markets only)
- Had to explicitly choose "All Markets" to see ended markets

### After (no closed filter):
- Search "bitcoin" → 25+ results (all markets)
- Default filter: "All Markets" (shows everything)
- Can choose "Active Only" to filter to tradeable markets

## API Notes

The Polymarket Gamma API:
- Returns ~500 markets per page
- We now fetch 4 pages (2000 markets) for comprehensive search
- The web UI may use additional search infrastructure we don't have access to
- Our implementation now matches web UI behavior of showing all markets by default
