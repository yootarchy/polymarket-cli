import chalk from 'chalk';
import ora from 'ora';
import { PolymarketAPI } from '../api';
import { formatWatchDisplay } from '../formatters';

/**
 * Watch a specific market with live updates
 */
export async function watchCommand(slug: string): Promise<void> {
  const api = new PolymarketAPI();
  let previousPrices: number[] | undefined;

  // Validate slug format (basic check)
  if (!slug || slug.length < 5) {
    console.error(chalk.red('\n❌ Error: Invalid market slug'));
    console.log(chalk.dim('Example: poly watch will-bitcoin-hit-100k'));
    process.exit(1);
  }

  // Setup graceful shutdown
  let running = true;
  process.on('SIGINT', () => {
    running = false;
    console.log(chalk.yellow('\n\n👋 Stopped watching market.'));
    process.exit(0);
  });

  const spinner = ora('Loading market data...').start();

  // Main update loop
  const update = async () => {
    try {
      const market = await api.getMarket(slug);
      spinner.stop();

      // Clear console and display
      console.clear();
      console.log(formatWatchDisplay(market, previousPrices));

      // Store current prices for next comparison
      if (market.outcomePrices && market.outcomePrices.length >= 2) {
        previousPrices = [
          parseFloat(market.outcomePrices[0]) * 100,
          parseFloat(market.outcomePrices[1]) * 100,
        ];
      }
    } catch (error) {
      spinner.stop();
      console.clear();
      console.error(chalk.red('\n❌ Error:'), (error as Error).message);
      console.log(chalk.dim('Check the market slug or try again later.'));
      process.exit(1);
    }
  };

  // Initial fetch
  await update();

  // Update every 30 seconds
  const interval = setInterval(async () => {
    if (!running) {
      clearInterval(interval);
      return;
    }
    await update();
  }, 30000);
}
