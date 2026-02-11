import chalk from 'chalk';
import ora from 'ora';
import { PolymarketAPI } from '../api';
import { formatMarketResult } from '../formatters';

/**
 * Show trending markets (by 24hr volume)
 */
export async function trendingCommand(): Promise<void> {
  const spinner = ora('Loading trending markets...').start();

  try {
    const api = new PolymarketAPI();
    const markets = await api.getTrendingMarkets(10);

    spinner.stop();

    if (markets.length === 0) {
      console.log(chalk.yellow('\n📈 No trending markets found.'));
      return;
    }

    console.log(chalk.bold.cyan('\n🔥 Top Trending Markets (24hr Volume):\n'));

    markets.forEach((market, index) => {
      console.log(formatMarketResult(market, index + 1));
      console.log(''); // Empty line between results
    });
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('\n❌ Error:'), (error as Error).message);
    console.log(chalk.dim('Check your internet connection or try again later.'));
    process.exit(1);
  }
}
