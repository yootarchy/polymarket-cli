import chalk from 'chalk';
import ora from 'ora';
import { CacheManager } from '../cache';

/**
 * Refresh the local events cache from Polymarket API
 */
export async function refreshCommand(): Promise<void> {
  const cacheManager = new CacheManager();
  
  console.log(chalk.cyan('\n🔄 Refreshing events cache from Polymarket API...'));
  console.log(chalk.dim('This will take 2-3 minutes to fetch all market details.\n'));
  
  let spinner = ora('Fetching active events...').start();
  
  try {
    const cache = await cacheManager.refreshCache((current, total, eventName) => {
      // Update spinner text with progress
      const truncatedName = eventName.length > 50 ? eventName.substring(0, 47) + '...' : eventName;
      spinner.text = `Fetching markets for event ${current}/${total}: ${truncatedName}`;
    });
    
    spinner.succeed('Cache refreshed successfully!');
    
    // Show stats
    const stats = cacheManager.getCacheStats(cache);
    console.log(chalk.bold('\n📊 Cache Statistics:'));
    console.log(`  ${chalk.cyan('•')} ${chalk.white(stats.totalEvents.toLocaleString())} active events`);
    console.log(`  ${chalk.cyan('•')} ${chalk.white(stats.totalMarkets.toLocaleString())} total markets (with full details)`);
    console.log(`  ${chalk.cyan('•')} ${chalk.white(stats.uniqueTags.toLocaleString())} unique tags`);
    console.log(`  ${chalk.cyan('•')} Last updated: ${chalk.dim(new Date(stats.lastUpdated).toLocaleString())}\n`);
    
    console.log(chalk.green('✓ You can now browse markets fully offline!\n'));
  } catch (error) {
    spinner.fail('Failed to refresh cache');
    console.error(chalk.red('\n❌ Error:'), (error as Error).message);
    console.log(chalk.dim('Make sure you have an active internet connection and try again.\n'));
    process.exit(1);
  }
}
