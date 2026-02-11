import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PolymarketAPI } from './api';

/**
 * Cached market details
 */
export interface CachedMarket {
  id: string;
  question: string;
  slug: string;
  conditionId: string;
  endDate?: string;
  outcomes?: string[];
  outcomePrices?: string[];
  volume?: string;
  volume24hr?: string;
  liquidity?: string;
  url: string;
}

/**
 * Cache entry for an event
 */
export interface CachedEvent {
  id: string;
  title: string;
  slug: string;
  tags: Array<{
    id: string;
    label: string;
    slug: string;
  }>;
  active: boolean;
  marketCount: number;
  volume?: string;
  liquidity?: string;
  updatedAt: string;
  markets: CachedMarket[]; // Full market details for offline browsing
}

/**
 * Cache structure
 */
export interface EventCache {
  events: CachedEvent[];
  lastUpdated: string;
  version: string;
}

const CACHE_VERSION = '2.0.0'; // Updated to include full market details
const CACHE_DIR = path.join(os.homedir(), '.polymarket-cli');
const CACHE_FILE = path.join(CACHE_DIR, 'events-cache.json');

/**
 * Cache Manager
 */
export class CacheManager {
  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  /**
   * Check if cache exists
   */
  cacheExists(): boolean {
    return fs.existsSync(CACHE_FILE);
  }

  /**
   * Load cache from disk
   */
  loadCache(): EventCache | null {
    try {
      if (!this.cacheExists()) {
        return null;
      }

      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      const cache = JSON.parse(data) as EventCache;

      // Validate cache version
      if (cache.version !== CACHE_VERSION) {
        console.warn('Cache version mismatch, will rebuild');
        return null;
      }

      return cache;
    } catch (error) {
      console.warn('Failed to load cache:', (error as Error).message);
      return null;
    }
  }

  /**
   * Save cache to disk
   */
  saveCache(cache: EventCache): void {
    try {
      this.ensureCacheDir();
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to save cache: ${(error as Error).message}`);
    }
  }

  /**
   * Refresh cache from API (with full market details)
   */
  async refreshCache(onProgress?: (current: number, total: number, eventName: string) => void): Promise<EventCache> {
    const api = new PolymarketAPI();
    const cachedEvents: CachedEvent[] = [];

    // Fetch events from API (multiple pages to get comprehensive coverage)
    const pageSize = 500;
    const maxPages = 10; // Up to 5000 events

    for (let page = 0; page < maxPages; page++) {
      try {
        const response = await api.fetchEvents({
          limit: pageSize,
          offset: page * pageSize,
          closed: false, // Only active events
        });

        if (response.length === 0) break;

        for (let i = 0; i < response.length; i++) {
          const event = response[i];
          const marketCount = Array.isArray(event.markets) ? event.markets.length : 0;
          
          // Only cache events with active markets
          if (marketCount === 0) continue;

          // Report progress
          const eventNumber = cachedEvents.length + 1;
          if (onProgress) {
            onProgress(eventNumber, cachedEvents.length + response.length - i, event.title || event.slug || 'Untitled');
          }

          // Extract and cache full market details
          const markets: CachedMarket[] = (event.markets || []).map((market: any) => {
            // Parse outcomes and prices if they're JSON strings
            let outcomes: string[] = ['Yes', 'No'];
            let outcomePrices: string[] | undefined = undefined;
            
            try {
              outcomes = Array.isArray(market.outcomes) ? market.outcomes : 
                        typeof market.outcomes === 'string' ? JSON.parse(market.outcomes) : ['Yes', 'No'];
            } catch (e) {
              // Use default if parsing fails
            }
            
            try {
              outcomePrices = Array.isArray(market.outcomePrices) ? market.outcomePrices :
                             typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : undefined;
            } catch (e) {
              // Leave undefined if parsing fails
            }
            
            const slug = market.slug || event.slug || '';
            
            return {
              id: market.id || market.conditionId,
              question: market.question || market.groupItemTitle || 'Unknown market',
              slug,
              conditionId: market.conditionId,
              endDate: market.endDateIso || market.endDate,
              outcomes,
              outcomePrices,
              volume: market.volumeNum?.toString() || market.volume,
              volume24hr: market.volume24hr,
              liquidity: market.liquidity,
              url: slug ? `https://polymarket.com/event/${slug}` : '',
            };
          });

          cachedEvents.push({
            id: event.id,
            title: event.title || event.slug || 'Untitled Event',
            slug: event.slug,
            tags: (event.tags || []).map((tag: any) => ({
              id: tag.id,
              label: tag.label,
              slug: tag.slug,
            })),
            active: event.active !== false,
            marketCount,
            volume: event.volume,
            liquidity: event.liquidity,
            updatedAt: new Date().toISOString(),
            markets,
          });

          // Rate limiting: small delay every 10 events to avoid overwhelming the API
          if ((eventNumber % 10) === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch page ${page}:`, (error as Error).message);
        break;
      }
    }

    const cache: EventCache = {
      events: cachedEvents,
      lastUpdated: new Date().toISOString(),
      version: CACHE_VERSION,
    };

    this.saveCache(cache);
    return cache;
  }

  /**
   * Search events by tag/keyword
   */
  searchEvents(query: string, cache: EventCache): CachedEvent[] {
    const queryLower = query.toLowerCase();
    
    // Match against event title, tags
    return cache.events.filter(event => {
      // Check title
      if (event.title.toLowerCase().includes(queryLower)) {
        return true;
      }

      // Check tags
      const tagMatch = event.tags.some(tag => 
        tag.label.toLowerCase().includes(queryLower) ||
        tag.slug.toLowerCase().includes(queryLower)
      );

      return tagMatch;
    });
  }

  /**
   * Get cache stats
   */
  getCacheStats(cache: EventCache): {
    totalEvents: number;
    totalMarkets: number;
    lastUpdated: string;
    uniqueTags: number;
  } {
    const totalEvents = cache.events.length;
    const totalMarkets = cache.events.reduce((sum, e) => sum + e.marketCount, 0);
    const allTags = new Set<string>();
    
    cache.events.forEach(event => {
      event.tags.forEach(tag => allTags.add(tag.label));
    });

    return {
      totalEvents,
      totalMarkets,
      lastUpdated: cache.lastUpdated,
      uniqueTags: allTags.size,
    };
  }

  /**
   * Get all unique tags from cache
   */
  getAllTags(cache: EventCache): Array<{ label: string; slug: string; count: number }> {
    const tagCounts = new Map<string, { label: string; slug: string; count: number }>();

    cache.events.forEach(event => {
      event.tags.forEach(tag => {
        const existing = tagCounts.get(tag.slug);
        if (existing) {
          existing.count++;
        } else {
          tagCounts.set(tag.slug, {
            label: tag.label,
            slug: tag.slug,
            count: 1,
          });
        }
      });
    });

    return Array.from(tagCounts.values()).sort((a, b) => b.count - a.count);
  }
}
