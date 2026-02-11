import axios, { AxiosInstance } from 'axios';

/**
 * Polymarket Gamma API Client
 * Documentation: https://docs.polymarket.com
 */

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com';
const CLOB_API_BASE = 'https://clob.polymarket.com';

export interface Market {
  condition_id: string;
  question: string;
  description?: string;
  end_date_iso: string;
  game_start_time?: string;
  question_id: string;
  market_slug?: string;
  outcomes: string[];
  outcomePrices?: string[];
  volume?: string;
  volume_24hr?: string;
  liquidity?: string;
  enableOrderBook?: boolean;
  active?: boolean;
}

export interface MarketPrice {
  market: string;
  price: string;
  side: string;
  timestamp: number;
}

export interface EventMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource?: string;
  endDate?: string;
  liquidity?: string;
  volume?: string;
  volume24hr?: string;
  startDate?: string;
  image?: string;
  icon?: string;
  description?: string;
  outcomes?: string[];
  outcomePrices?: string[];
  tokens?: Array<{
    token_id: string;
    outcome: string;
    price: string;
  }>;
  clobTokenIds?: string[];
  closed?: boolean;
  marketType?: string;
  groupItemTitle?: string;
  groupItemThreshold?: string;
  // Tag data from parent event
  eventTags?: Array<{
    id: string;
    label: string;
    slug: string;
  }>;
}

export interface SearchResponse {
  data: EventMarket[];
  count: number;
  limit: number;
  offset: number;
}

/**
 * API Client for Polymarket
 */
export class PolymarketAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Parse outcome prices if they're JSON strings
   */
  private parseMarket(market: any): EventMarket {
    if (typeof market.outcomePrices === 'string') {
      try {
        market.outcomePrices = JSON.parse(market.outcomePrices);
      } catch {
        // Keep as string if parsing fails
      }
    }
    if (typeof market.outcomes === 'string') {
      try {
        market.outcomes = JSON.parse(market.outcomes);
      } catch {
        // Keep as string if parsing fails
      }
    }
    return market as EventMarket;
  }

  /**
   * Fetch events from API (for cache building)
   * @param params - Query parameters
   */
  async fetchEvents(params: { limit: number; offset: number; closed?: boolean }): Promise<any[]> {
    try {
      const response = await this.client.get<any[]>(`${GAMMA_API_BASE}/events`, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get event by slug
   * @param slug - Event slug
   */
  async getEvent(slug: string): Promise<any> {
    try {
      const response = await this.client.get<any>(`${GAMMA_API_BASE}/events/${slug}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search markets by keyword
   * @param query - Search term
   * @param limit - Maximum results to return
   * @param activeOnly - If true, only return active/tradeable markets (default: true, shows only open markets)
   */
  async searchMarkets(query: string, limit: number = 100, activeOnly: boolean = true): Promise<EventMarket[]> {
    try {
      // Use the /events endpoint to get CURRENT markets instead of ancient ones
      // The /markets endpoint returns oldest markets first (2020-2021), which is useless
      const allMarkets: any[] = [];
      const pageSize = 500; // API max per request
      const maxPages = 10; // Fetch up to 5000 events to get comprehensive coverage
      
      for (let page = 0; page < maxPages; page++) {
        const params: any = { 
          limit: pageSize, 
          offset: page * pageSize,
        };
        
        // By default, only fetch open markets (closed=false)
        // This gives us CURRENT markets instead of archaeological artifacts
        if (activeOnly) {
          params.closed = false;
        }
        
        const response = await this.client.get<any[]>(`${GAMMA_API_BASE}/events`, { params });
        
        if (response.data.length === 0) break;
        
        // Extract all nested markets from events and attach event tags
        for (const event of response.data) {
          if (event.markets && Array.isArray(event.markets)) {
            // Attach event tags to each market for better search matching
            const eventTags = event.tags || [];
            const marketsWithTags = event.markets.map((market: any) => ({
              ...market,
              eventTags: eventTags.map((tag: any) => ({
                id: tag.id,
                label: tag.label,
                slug: tag.slug,
              })),
            }));
            allMarkets.push(...marketsWithTags);
          }
        }
      }

      const parsedMarkets = allMarkets.map(m => this.parseMarket(m));
      
      // Client-side search filter with smart matching
      const queryLower = query.toLowerCase();
      
      // For short queries (<=3 chars), use strict word-boundary matching
      // to avoid matching "eth" in "whether", "btc" in "etc."
      const useStrictMatching = queryLower.length <= 3;
      
      // Create regex for word boundary matching (e.g., "eth" matches "Ethereum" but not "whether")
      const wordBoundaryRegex = new RegExp(`\\b${queryLower}`, 'i');
      
      const filtered = parsedMarkets.filter(market => {
        const question = market.question || '';
        const description = market.description || '';
        const groupTitle = market.groupItemTitle || '';
        
        // Build tag text from all event tags
        const tagText = (market.eventTags || [])
          .map(tag => `${tag.label} ${tag.slug}`)
          .join(' ');
        
        // Combine all searchable text including tags
        const combined = `${question} ${description} ${groupTitle} ${tagText}`;
        
        if (useStrictMatching) {
          // Strict: only match word boundaries for short queries
          return wordBoundaryRegex.test(combined);
        } else {
          // Flexible: substring match for longer queries
          return combined.toLowerCase().includes(queryLower);
        }
      });

      return filtered.slice(0, limit);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get market details by slug
   * @param slug - Market slug (from URL, e.g., "will-bitcoin-hit-100k")
   */
  async getMarket(slug: string): Promise<EventMarket> {
    try {
      const response = await this.client.get<any>(
        `${GAMMA_API_BASE}/markets/${slug}`
      );

      return this.parseMarket(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get trending markets (by 24hr volume)
   */
  async getTrendingMarkets(limit: number = 10): Promise<EventMarket[]> {
    try {
      // Use /events endpoint and extract markets, then sort by volume
      const allMarkets: any[] = [];
      const pageSize = 500;
      const maxPages = 4; // Fetch 2000 events
      
      for (let page = 0; page < maxPages; page++) {
        const response = await this.client.get<any[]>(
          `${GAMMA_API_BASE}/events`,
          {
            params: {
              limit: pageSize,
              offset: page * pageSize,
              closed: false, // Only open markets
            },
          }
        );
        
        if (response.data.length === 0) break;
        
        for (const event of response.data) {
          if (event.markets && Array.isArray(event.markets)) {
            // Attach event tags to each market
            const eventTags = event.tags || [];
            const marketsWithTags = event.markets.map((market: any) => ({
              ...market,
              eventTags: eventTags.map((tag: any) => ({
                id: tag.id,
                label: tag.label,
                slug: tag.slug,
              })),
            }));
            allMarkets.push(...marketsWithTags);
          }
        }
      }

      // Sort by 24hr volume
      const sorted = allMarkets
        .map(m => this.parseMarket(m))
        .sort((a, b) => {
          const volA = parseFloat(a.volume24hr || '0');
          const volB = parseFloat(b.volume24hr || '0');
          return volB - volA;
        });

      return sorted.slice(0, limit);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get markets ending soon
   */
  async getEndingSoonMarkets(daysAhead: number = 7, limit: number = 10): Promise<EventMarket[]> {
    try {
      const now = new Date();
      const future = new Date();
      future.setDate(future.getDate() + daysAhead);

      // Use /events endpoint to get current markets
      const allMarkets: any[] = [];
      const pageSize = 500;
      const maxPages = 4; // Fetch 2000 events
      
      for (let page = 0; page < maxPages; page++) {
        const response = await this.client.get<any[]>(
          `${GAMMA_API_BASE}/events`,
          {
            params: {
              limit: pageSize,
              offset: page * pageSize,
              closed: false, // Only open markets
            },
          }
        );
        
        if (response.data.length === 0) break;
        
        for (const event of response.data) {
          if (event.markets && Array.isArray(event.markets)) {
            // Attach event tags to each market
            const eventTags = event.tags || [];
            const marketsWithTags = event.markets.map((market: any) => ({
              ...market,
              eventTags: eventTags.map((tag: any) => ({
                id: tag.id,
                label: tag.label,
                slug: tag.slug,
              })),
            }));
            allMarkets.push(...marketsWithTags);
          }
        }
      }

      // Parse and filter markets ending within the specified timeframe
      const filtered = allMarkets
        .map(m => this.parseMarket(m))
        .filter((market) => {
          if (!market.endDate) return false;
          const endDate = new Date(market.endDate);
          return endDate >= now && endDate <= future;
        })
        .sort((a, b) => {
          const dateA = new Date(a.endDate!).getTime();
          const dateB = new Date(b.endDate!).getTime();
          return dateA - dateB;
        })
        .slice(0, limit);

      return filtered;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }
}
