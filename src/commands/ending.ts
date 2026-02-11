import chalk from 'chalk';
import ora from 'ora';
import { PolymarketAPI } from '../api';
import { formatMarketResult } from '../formatters';

/**
 * Show markets ending soon (<7 days)
 */
export async function endingCommand(): Promise<void> {
  const spinner = ora('Loading markets ending soon...').start();

  try {
    const api = new PolymarketAPI();
    const markets = await api.getEndingSoonMarkets(7, 10);

    spinner.stop();

    if (markets.length === 0) {
      console.log(chalk.yellow('\n⏰ No markets ending in the next 7 days.'));
      return;
    }

    console.log(chalk.bold.cyan('\n⏰ Markets Ending Soon (Next 7 Days):\n'));

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
