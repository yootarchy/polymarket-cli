import chalk from 'chalk';
import ora from 'ora';
import { CacheManager } from '../cache';
import { formatVolume } from '../formatters';

/**
 * Search events by tag/keyword (using local cache)
 */
export async function searchCommand(query: string): Promise<void> {
  const cacheManager = new CacheManager();

  // Check if cache exists, if not prompt to refresh
  if (!cacheManager.cacheExists()) {
    console.log(chalk.yellow('\n⚠️  Cache not found. Building cache for the first time...'));
    console.log(chalk.dim('This will take ~30 seconds. Run "polymarket refresh" to update later.\n'));
    
    const spinner = ora('Fetching events from Polymarket API...').start();
    
    try {
      await cacheManager.refreshCache();
      spinner.succeed('Cache built successfully!');
    } catch (error) {
      spinner.fail('Failed to build cache');
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  }

  // Load cache
  const cache = cacheManager.loadCache();
  if (!cache) {
    console.error(chalk.red('\n❌ Failed to load cache. Try running "polymarket refresh"'));
    process.exit(1);
  }

  // Search events
  const results = cacheManager.searchEvents(query, cache);

  if (results.length === 0) {
    console.log(chalk.yellow(`\nNo tags found matching '${query}'`));
    console.log(chalk.dim('Try a different search term or run "poly refresh" to update cache.'));
    return;
  }

  // Display results - simple format matching spec
  console.log(chalk.cyan(`\nFound ${results.length} event${results.length === 1 ? '' : 's'} matching tag "${query}":`));

  results.forEach((event, index) => {
    const marketCount = event.marketCount;
    console.log(`${index + 1}. ${event.title} (${marketCount} active market${marketCount === 1 ? '' : 's'})`);
  });

  // Show cache info
  console.log(chalk.dim(`\nCache last updated: ${new Date(cache.lastUpdated).toLocaleString()}`));
  console.log(chalk.dim('Run "poly refresh" to update cache with latest events.'));
}
