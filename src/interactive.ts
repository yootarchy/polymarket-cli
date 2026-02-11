import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { PolymarketAPI, EventMarket } from './api';
import { CacheManager } from './cache';
import { formatMarketResult, formatVolume } from './formatters';

/**
 * Interactive TUI mode for Polymarket CLI
 * Provides arrow-key navigation and persistent session
 */

const api = new PolymarketAPI();
const cache = new CacheManager();

type MainMenuAction = 'search' | 'trending' | 'ending' | 'refresh' | 'quit';

interface MainMenuChoice {
  name: string;
  value: MainMenuAction;
}

const MAIN_MENU: MainMenuChoice[] = [
  { name: '🔍 Search events by tag', value: 'search' },
  { name: '🔥 Trending markets', value: 'trending' },
  { name: '⏰ Ending soon', value: 'ending' },
  { name: '🔄 Refresh cache', value: 'refresh' },
  { name: '❌ Quit', value: 'quit' },
];

/**
 * Clear screen and show header
 */
function showHeader() {
  console.clear();
  console.log(chalk.cyan('╔══════════════════════════════════════════╗'));
  console.log(chalk.cyan('║   🎲 Polymarket CLI - Interactive Mode   ║'));
  console.log(chalk.cyan('╚══════════════════════════════════════════╝'));
  console.log();
  console.log(chalk.dim('Navigate with ↑↓ arrows • Press Q to quit'));
  console.log();
}

/**
 * Show main menu
 */
async function showMainMenu(): Promise<MainMenuAction> {
  const { action } = await inquirer.prompt<{ action: MainMenuAction }>([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: MAIN_MENU,
      pageSize: 10,
    },
  ]);

  return action;
}

/**
 * Search events by tag
 */
async function searchEventsByTag(): Promise<void> {
  showHeader();
  
  // Ensure cache exists
  if (!cache.cacheExists()) {
    console.log(chalk.yellow('⚠️  Cache not found. Building cache for the first time...'));
    console.log(chalk.dim('This will take 2-3 minutes to fetch all market details.\n'));
    
    let spinner = ora('Fetching events from Polymarket API...').start();
    
    try {
      await cache.refreshCache((current, total, eventName) => {
        const truncatedName = eventName.length > 45 ? eventName.substring(0, 42) + '...' : eventName;
        spinner.text = `Fetching markets ${current}/${total}: ${truncatedName}`;
      });
      spinner.succeed('Cache built successfully!');
      console.log();
    } catch (error) {
      spinner.fail('Failed to build cache');
      console.error(chalk.red('Error:'), (error as Error).message);
      await waitForUser();
      return;
    }
  }

  const { query } = await inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Enter search query (tag/keyword):',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Please enter a search term';
        }
        return true;
      },
    },
  ]);

  // Load cache and search
  const cacheData = cache.loadCache();
  if (!cacheData) {
    console.log(chalk.red('\n❌ Failed to load cache'));
    await waitForUser();
    return;
  }

  const results = cache.searchEvents(query.trim(), cacheData);

  if (results.length === 0) {
    console.log(chalk.yellow(`\n⚠️  No events found matching "${query}"`));
    console.log(chalk.dim('Try a different search term.\n'));
    await waitForUser();
    return;
  }

  // Display results as navigable list
  while (true) {
    console.log(chalk.cyan(`\nFound ${results.length} event${results.length === 1 ? '' : 's'} matching "${query}":\n`));

    const choices = results.map((event, idx) => ({
      name: `${idx + 1}. ${event.title} (${event.marketCount} market${event.marketCount === 1 ? '' : 's'})`,
      value: idx,
    }));

    choices.push({ name: chalk.dim('← Back to search'), value: -1 });
    choices.push({ name: chalk.dim('← Main menu'), value: -2 });

    const { eventIndex } = await inquirer.prompt<{ eventIndex: number }>([
      {
        type: 'list',
        name: 'eventIndex',
        message: 'Select an event to view markets:',
        choices,
        pageSize: 15,
      },
    ]);

    if (eventIndex === -2) {
      // Back to main menu
      return;
    }

    if (eventIndex === -1) {
      // New search
      return searchEventsByTag();
    }

    // Show markets for selected event
    await showEventMarkets(results[eventIndex]);
  }
}

/**
 * Format outcome prices as percentages
 */
function formatOdds(outcomePrices?: string[]): string {
  if (!outcomePrices || outcomePrices.length === 0) {
    return 'N/A';
  }
  
  // Convert prices to percentages (prices are typically 0-1 range)
  const percentages = outcomePrices.map(price => {
    const num = parseFloat(price);
    const pct = (num * 100).toFixed(1);
    return `${pct}%`;
  });
  
  // For binary markets, show Yes/No
  if (percentages.length === 2) {
    return `Yes: ${percentages[0]}, No: ${percentages[1]}`;
  }
  
  // For multi-outcome markets, show all outcomes
  return percentages.join(', ');
}

/**
 * Show markets for a specific event (from cache)
 */
async function showEventMarkets(event: any): Promise<void> {
  if (!event.markets || event.markets.length === 0) {
    showHeader();
    console.log(chalk.bold.cyan(`📊 Event: ${event.title}\n`));
    console.log(chalk.dim('\nNo markets available for this event.'));
    await waitForUser('Press Enter to go back...');
    return;
  }

  // Navigate through markets
  while (true) {
    showHeader();
    console.log(chalk.bold.cyan(`📊 Event: ${event.title}\n`));
    console.log(chalk.dim(`Markets: ${event.marketCount}`));
    
    const tagLabels = event.tags.map((t: any) => t.label).join(', ');
    if (tagLabels) {
      console.log(chalk.dim(`Tags: ${tagLabels}`));
    }
    console.log();

    // Create choices for market selection
    const choices = event.markets.map((market: any, idx: number) => {
      const odds = formatOdds(market.outcomePrices);
      const endDate = market.endDate 
        ? new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No end date';
      
      return {
        name: `${idx + 1}. ${market.question}\n   ${chalk.dim(`Odds: ${odds} | Ends: ${endDate}`)}`,
        value: idx,
        short: market.question,
      };
    });

    choices.push({ name: chalk.dim('\n← Back'), value: -1, short: 'Back' });

    const { marketIndex } = await inquirer.prompt<{ marketIndex: number }>([
      {
        type: 'list',
        name: 'marketIndex',
        message: 'Select a market for details:',
        choices,
        pageSize: 12,
      },
    ]);

    if (marketIndex === -1) {
      return;
    }

    // Show detailed market view
    await showCachedMarketDetails(event.markets[marketIndex]);
  }
}

/**
 * Show detailed view of a cached market
 */
async function showCachedMarketDetails(market: any): Promise<void> {
  showHeader();
  
  console.log(chalk.bold.cyan('📊 Market Details\n'));
  console.log(chalk.bold(market.question));
  console.log();
  
  // Outcomes and odds
  if (market.outcomes && market.outcomePrices) {
    console.log(chalk.bold('Current Odds:'));
    market.outcomes.forEach((outcome: string, idx: number) => {
      const price = parseFloat(market.outcomePrices[idx] || '0');
      const pct = (price * 100).toFixed(1);
      console.log(`  ${chalk.cyan('•')} ${outcome}: ${chalk.white(pct + '%')}`);
    });
    console.log();
  }
  
  // End date
  if (market.endDate) {
    const endDate = new Date(market.endDate);
    console.log(`${chalk.bold('Ends:')} ${endDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })}`);
    console.log();
  }
  
  // Volume stats
  if (market.volume24hr) {
    console.log(`${chalk.bold('24h Volume:')} ${formatVolume(market.volume24hr)}`);
  }
  if (market.volume) {
    console.log(`${chalk.bold('Total Volume:')} ${formatVolume(market.volume)}`);
  }
  if (market.liquidity) {
    console.log(`${chalk.bold('Liquidity:')} ${formatVolume(market.liquidity)}`);
  }
  console.log();
  
  // URL
  if (market.url) {
    console.log(`${chalk.bold('URL:')} ${chalk.blue.underline(market.url)}`);
    console.log();
  }

  await waitForUser('Press Enter to go back...');
}

/**
 * Show trending markets
 */
async function showTrendingMarkets(): Promise<void> {
  showHeader();
  
  const spinner = ora('Loading trending markets...').start();

  try {
    const markets = await api.getTrendingMarkets(15);
    spinner.stop();

    if (markets.length === 0) {
      console.log(chalk.yellow('📈 No trending markets found.'));
      await waitForUser();
      return;
    }

    while (true) {
      console.log(chalk.bold.cyan('\n🔥 Top Trending Markets (24hr Volume):\n'));

      const choices = markets.map((market, idx) => {
        const volumeStr = market.volume24hr 
          ? `${formatVolume(market.volume24hr)}/24h` 
          : market.volume 
            ? formatVolume(market.volume)
            : 'Unknown';
        
        return {
          name: `${idx + 1}. ${market.question} (${volumeStr})`,
          value: idx,
        };
      });

      choices.push({ name: chalk.dim('← Main menu'), value: -1 });

      const { marketIndex } = await inquirer.prompt<{ marketIndex: number }>([
        {
          type: 'list',
          name: 'marketIndex',
          message: 'Select a market for details:',
          choices,
          pageSize: 15,
        },
      ]);

      if (marketIndex === -1) {
        return;
      }

      // Show market details
      await showMarketDetails(markets[marketIndex]);
      showHeader();
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('\n❌ Error:'), (error as Error).message);
    console.log(chalk.dim('Check your internet connection or try again later.'));
    await waitForUser();
  }
}

/**
 * Show markets ending soon
 */
async function showEndingSoon(): Promise<void> {
  showHeader();
  
  const spinner = ora('Loading markets ending soon...').start();

  try {
    const markets = await api.getEndingSoonMarkets(7, 15);
    spinner.stop();

    if (markets.length === 0) {
      console.log(chalk.yellow('\n⏰ No markets ending in the next 7 days.'));
      await waitForUser();
      return;
    }

    while (true) {
      console.log(chalk.bold.cyan('\n⏰ Markets Ending Soon (Next 7 Days):\n'));

      const choices = markets.map((market, idx) => {
        const endDate = market.endDate 
          ? new Date(market.endDate).toLocaleDateString()
          : 'Unknown';
        
        return {
          name: `${idx + 1}. ${market.question} (Ends: ${endDate})`,
          value: idx,
        };
      });

      choices.push({ name: chalk.dim('← Main menu'), value: -1 });

      const { marketIndex } = await inquirer.prompt<{ marketIndex: number }>([
        {
          type: 'list',
          name: 'marketIndex',
          message: 'Select a market for details:',
          choices,
          pageSize: 15,
        },
      ]);

      if (marketIndex === -1) {
        return;
      }

      // Show market details
      await showMarketDetails(markets[marketIndex]);
      showHeader();
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('\n❌ Error:'), (error as Error).message);
    console.log(chalk.dim('Check your internet connection or try again later.'));
    await waitForUser();
  }
}

/**
 * Show detailed market information
 */
async function showMarketDetails(market: EventMarket): Promise<void> {
  showHeader();
  
  console.log(formatMarketResult(market, 0));
  console.log();
  
  await waitForUser('Press Enter to go back...');
}

/**
 * Refresh cache
 */
async function refreshCache(): Promise<void> {
  showHeader();
  
  console.log(chalk.yellow('🔄 Refreshing event cache...'));
  console.log(chalk.dim('This will take 2-3 minutes to fetch all market details.\n'));
  
  let spinner = ora('Fetching events from Polymarket API...').start();
  
  try {
    await cache.refreshCache((current, total, eventName) => {
      // Update spinner text with progress
      const truncatedName = eventName.length > 45 ? eventName.substring(0, 42) + '...' : eventName;
      spinner.text = `Fetching markets ${current}/${total}: ${truncatedName}`;
    });
    
    spinner.succeed('Cache refreshed successfully!');
    
    const cacheData = cache.loadCache();
    if (cacheData) {
      const stats = cache.getCacheStats(cacheData);
      console.log(chalk.green(`\n✓ Cached ${stats.totalEvents} events with ${stats.totalMarkets} markets`));
      console.log(chalk.dim(`  Last updated: ${new Date(cacheData.lastUpdated).toLocaleString()}`));
    }
    console.log();
    await waitForUser();
  } catch (error) {
    spinner.fail('Failed to refresh cache');
    console.error(chalk.red('Error:'), (error as Error).message);
    await waitForUser();
  }
}

/**
 * Wait for user to press Enter
 */
async function waitForUser(message: string = 'Press Enter to continue...'): Promise<void> {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message,
    },
  ]);
}

/**
 * Main interactive loop
 */
export async function startInteractiveMode(): Promise<void> {
  showHeader();

  console.log(chalk.green('Welcome to Polymarket CLI Interactive Mode!\n'));
  console.log(chalk.dim('Use arrow keys to navigate, Enter to select.\n'));

  // Main loop - stays open until user quits
  while (true) {
    try {
      const action = await showMainMenu();

      switch (action) {
        case 'search':
          await searchEventsByTag();
          showHeader();
          break;

        case 'trending':
          await showTrendingMarkets();
          showHeader();
          break;

        case 'ending':
          await showEndingSoon();
          showHeader();
          break;

        case 'refresh':
          await refreshCache();
          showHeader();
          break;

        case 'quit':
          console.clear();
          console.log(chalk.cyan('\n👋 Thanks for using Polymarket CLI!\n'));
          process.exit(0);
      }
    } catch (error) {
      // Handle Ctrl+C gracefully
      if ((error as any).isTtyError) {
        console.log(chalk.red('\n❌ Interactive mode not supported in this environment'));
        process.exit(1);
      } else if (error instanceof Error && 
                 (error.message.includes('User force closed') || 
                  error.message.includes('force closed the prompt'))) {
        console.clear();
        console.log(chalk.cyan('\n👋 Thanks for using Polymarket CLI!\n'));
        process.exit(0);
      } else {
        console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
        
        const { retry } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'retry',
            message: 'Continue using interactive mode?',
            default: true,
          },
        ]);

        if (!retry) {
          console.clear();
          console.log(chalk.cyan('\n👋 Thanks for using Polymarket CLI!\n'));
          process.exit(0);
        }

        showHeader();
      }
    }
  }
}
