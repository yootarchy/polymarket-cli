# Bug Fix Summary: Polymarket CLI Filtering Issue

## Issue
Search for "bitcoin" → 14 results → Select "Trending" filter → "No markets found"

## Root Cause
The API was returning **only historical/closed markets** from 2020-2021 when searching without the `closed=false` parameter. All 14 Bitcoin markets found were legitimately closed, so the `isActive()` filter correctly removed them all.

## Solution

### 1. Updated `src/api.ts` - `searchMarkets()` function
**Before:**
```typescript
async searchMarkets(query: string, limit: number = 100): Promise<EventMarket[]> {
  // Fetched ALL markets (no closed filter)
  const response = await this.client.get(`${GAMMA_API_BASE}/markets`, {
    params: { limit: 1000, offset: 0 }
  });
  // Only closed/historical markets were returned for many searches
}
```

**After:**
```typescript
async searchMarkets(query: string, limit: number = 100, includeInactive: boolean = false): Promise<EventMarket[]> {
  if (includeInactive) {
    // Merge both active and closed markets
    const [activeResponse, closedResponse] = await Promise.all([
      this.client.get(`${GAMMA_API_BASE}/markets`, { params: { closed: false } }),
      this.client.get(`${GAMMA_API_BASE}/markets`, { params: {} })
    ]);
    // Deduplicate and merge
  } else {
    // Fetch only active markets (default)
    const response = await this.client.get(`${GAMMA_API_BASE}/markets`, {
      params: { closed: false }
    });
  }
}
```

### 2. Updated `src/interactive.ts`
- Added `showingAllMarkets` flag to track current state
- Auto-fetches all markets when "All Markets" filter is selected
- Re-fetches active-only markets when switching back to other filters
- Improved error messages with helpful suggestions
- Better user feedback showing "active markets" vs "all markets"

### 3. Improved Filter Logic
- Made `isActive()` check more explicit: `m.closed !== true` instead of `!m.closed`
- Added proper comments explaining market active state logic
- All filters now work correctly with active markets

## Test Results

### Bitcoin (Original Bug)
- **Before:** 0 markets shown in Trending ❌
- **After:** 1 market shown: "Will bitcoin hit $1m before GTA VI?" ✅

### Trump Markets
- **Trending:** 11 markets (sorted by 24h volume) ✅
- **Ending Soon:** 0 markets (none ending <7 days) ✅
- **Long-Term:** 11 markets (ending >30 days) ✅
- **All Markets:** 57 markets (21 active + 36 closed) ✅

## Changes Made

### Files Modified:
1. `src/api.ts` - Updated `searchMarkets()` to filter for active markets by default
2. `src/interactive.ts` - Smart filter switching and better UX

### Key Improvements:
- ✅ Active markets show correctly in all filters
- ✅ Historical markets only show in "All Markets" filter
- ✅ Helpful error messages when no matches
- ✅ Proper API result merging for "All Markets"
- ✅ No false negatives - active markets always visible

## Testing

Run the fixed CLI:
```bash
npm run build
node dist/index.js
```

Test the original bug scenario:
1. Search: "bitcoin"
2. Select: "Trending (24hr volume)"
3. Expected: Shows 1 active market ✅
4. Previous behavior: "No markets found" ❌

## API Quirk Discovered

The Polymarket Gamma API returns **different result sets** based on the `closed` parameter:
- `closed=false` → Returns recent/active markets
- No `closed` param → Returns older/historical markets

To get ALL markets, we must fetch both and merge them with deduplication.
