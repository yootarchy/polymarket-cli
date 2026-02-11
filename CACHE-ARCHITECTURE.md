# Polymarket CLI - Cache Architecture

## Overview

The Polymarket CLI now uses a **local cache architecture** for fast, offline-capable event discovery. This solves the previous problems of:
- ❌ Searches returning ended/inactive markets
- ❌ API rate limits from repeated queries
- ❌ Slow response times

## Architecture

### 1. Local Cache System

**Location:** `~/.polymarket-cli/events-cache.json`

**Structure:**
```json
{
  "events": [
    {
      "id": "16167",
      "title": "MicroStrategy sells any Bitcoin by ___ ?",
      "slug": "microstrategy-sell-any-bitcoin-in-2025",
      "tags": [
        { "id": "120", "label": "Finance", "slug": "finance" },
        { "id": "21", "label": "Crypto", "slug": "crypto" }
      ],
      "active": true,
      "marketCount": 4,
      "volume": "20301344.882251",
      "liquidity": "255447.67168",
      "updatedAt": "2026-02-11T11:58:08.692Z"
    }
  ],
  "lastUpdated": "2026-02-11T11:58:09.692Z",
  "version": "1.0.0"
}
```

**Key Features:**
- Only stores **active events** (no ended markets)
- Includes all associated **tags** for each event
- Tracks **market count** per event
- Stores **volume** and **liquidity** for sorting/filtering

### 2. Refresh Command

**Usage:** `poly refresh`

**What it does:**
1. Fetches all active events from Polymarket API
2. Extracts tags and market counts
3. Saves to local cache file
4. Shows statistics (total events, markets, tags)

**When to run:**
- Automatically on first use (if cache doesn't exist)
- Manually when you want latest data (recommended: daily)

**Example:**
```bash
$ poly refresh

🔄 Refreshing events cache from Polymarket API...
This will take ~30 seconds.

✓ Cache refreshed successfully!

📊 Cache Statistics:
  • 5,000 active events
  • 39,845 total markets
  • 976 unique tags
  • Last updated: 2/11/2026, 7:58:09 PM

✓ You can now use "poly search <query>" to find events!
```

### 3. Search (Cache-Based)

**Usage:** `poly search <query>`

**How it works:**
1. Loads cache from disk (instant)
2. Searches event titles and tags (substring match)
3. Returns matching events with market counts
4. No API calls = fast & works offline!

**Example - Success:**
```bash
$ poly search bitcoin

Found 49 events matching tag "bitcoin":
1. MicroStrategy sells any Bitcoin by ___ ? (4 active markets)
2. When will Bitcoin hit $150k? (5 active markets)
3. Will knots flip bitcoin core by ___? (2 active markets)
...

Cache last updated: 2/11/2026, 7:58:09 PM
Run "poly refresh" to update cache with latest events.
```

**Example - No Match:**
```bash
$ poly search asdfasdf

No tags found matching 'asdfasdf'
Try a different search term or run "poly refresh" to update cache.
```

### 4. Auto-Refresh on First Run

If cache doesn't exist when you run `poly search`, it automatically builds the cache:

```bash
$ poly search crypto

⚠️  Cache not found. Building cache for the first time...
This will take ~30 seconds. Run "poly refresh" to update later.

✓ Cache built successfully!

Found 313 events matching tag "crypto":
...
```

## Implementation Details

### CacheManager Class (`src/cache.ts`)

**Key Methods:**

- `cacheExists()` - Check if cache file exists
- `loadCache()` - Load cache from disk
- `saveCache()` - Save cache to disk
- `refreshCache()` - Rebuild cache from API
- `searchEvents()` - Query cache for matching events
- `getCacheStats()` - Get statistics about cached data
- `getAllTags()` - Get all unique tags with counts

### Search Algorithm

**Flexible substring matching:**
- Searches event **title**
- Searches tag **labels** and **slugs**
- Case-insensitive
- Returns all matches (not limited by default)

### Cache Refresh Strategy

**Fetches from Polymarket API:**
- Multiple pages (up to 10 pages, 500 events each)
- Only `closed: false` (active events only)
- Extracts nested markets from events
- Calculates market count per event
- Preserves tag associations

## Benefits

✅ **Fast:** No API calls for searches  
✅ **Offline:** Works without internet (after initial cache)  
✅ **Current:** Only shows active markets  
✅ **Flexible:** Substring matching finds relevant events  
✅ **Efficient:** Avoids rate limits  
✅ **Simple:** Just JSON files, no database needed  

## Cache Management

**When to refresh:**
- Daily (for up-to-date events)
- Before important trading decisions
- When search results seem stale

**Cache size:**
- ~3.7 MB for 5,000 events
- Negligible disk space
- Loads instantly into memory

**Cache location:**
```bash
~/.polymarket-cli/events-cache.json
```

## Future Improvements (Optional)

- Auto-refresh after N days
- Cache expiration warnings
- Tag-based autocomplete
- Sort by volume/liquidity
- Filter by tag combinations

## Commands Summary

| Command | Description | API Calls |
|---------|-------------|-----------|
| `poly search <query>` | Search events in cache | 0 (uses cache) |
| `poly refresh` | Rebuild cache from API | ~10 (once) |
| `poly trending` | Show trending markets | Multiple (live) |
| `poly ending` | Show markets ending soon | Multiple (live) |
| `poly watch <id>` | Monitor a market | Live updates |

## Testing

```bash
# Build
npm run build

# Test refresh
node dist/index.js refresh

# Test search
node dist/index.js search bitcoin
node dist/index.js search politics
node dist/index.js search asdfasdf

# Check cache
ls -lh ~/.polymarket-cli/
cat ~/.polymarket-cli/events-cache.json | head -50
```

---

**Status:** ✅ Production-ready prototype  
**Last Updated:** 2026-02-11  
**Version:** 2.0.0
