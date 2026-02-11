import chalk from 'chalk';
import { formatDistanceToNow, format } from 'date-fns';
import { EventMarket } from './api';

/**
 * Format a market for display in search results
 */
export function formatMarketResult(market: EventMarket, index: number): string {
  const lines: string[] = [];

  // Market number and question
  lines.push(chalk.bold(`${index}. ${market.question}`));

  // Outcomes and prices
  if (market.outcomePrices && market.outcomePrices.length >= 2) {
    const yesPrice = parseFloat(market.outcomePrices[0]) * 100;
    const noPrice = parseFloat(market.outcomePrices[1]) * 100;

    const yesColor = yesPrice > noPrice ? chalk.green : chalk.dim;
    const noColor = noPrice > yesPrice ? chalk.red : chalk.dim;

    const yesArrow = yesPrice > noPrice ? '↑' : '';
    const noArrow = noPrice > yesPrice ? '↑' : '';

    lines.push(
      `   ${yesColor(`YES: ${yesPrice.toFixed(1)}% ${yesArrow}`)}  ${noColor(`NO: ${noPrice.toFixed(1)}% ${noArrow}`)}`
    );
  }

  // Tags (if available) - show first 3 most relevant
  if (market.eventTags && market.eventTags.length > 0) {
    const tagLabels = market.eventTags
      .slice(0, 3)
      .map(tag => tag.label)
      .join(', ');
    lines.push(`   ${chalk.blue('Tags:')} ${chalk.dim(tagLabels)}`);
  }

  // Volume and end date
  const volumeStr = market.volume24hr
    ? formatVolume(market.volume24hr)
    : market.volume
    ? formatVolume(market.volume)
    : 'N/A';

  const endDateStr = market.endDate
    ? formatEndDate(market.endDate)
    : 'No end date';

  lines.push(`   Volume: ${chalk.cyan(volumeStr)}  Ends: ${chalk.yellow(endDateStr)}`);

  // Market URL
  if (market.slug) {
    lines.push(chalk.dim(`   https://polymarket.com/event/${market.slug}`));
  }

  return lines.join('\n');
}

/**
 * Format volume as a human-readable string
 */
export function formatVolume(volume: string | number): string {
  const num = typeof volume === 'string' ? parseFloat(volume) : volume;

  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  } else {
    return `$${num.toFixed(0)}`;
  }
}

/**
 * Format end date
 */
export function formatEndDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();

    // If date is in the past
    if (date < now) {
      return 'Ended';
    }

    // If within 7 days, show relative time
    const daysUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntil < 7) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    // Otherwise show formatted date
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Format a market for watch mode
 */
export function formatWatchDisplay(market: EventMarket, previousPrices?: number[]): string {
  const lines: string[] = [];

  // Clear screen and show header
  lines.push(chalk.bold.cyan('📊 Polymarket Live Monitor'));
  lines.push('');
  lines.push(chalk.bold(market.question));
  lines.push('');

  // Current prices
  if (market.outcomePrices && market.outcomePrices.length >= 2) {
    const yesPrice = parseFloat(market.outcomePrices[0]) * 100;
    const noPrice = parseFloat(market.outcomePrices[1]) * 100;

    // Determine change arrows
    let yesArrow = '';
    let noArrow = '';

    if (previousPrices && previousPrices.length >= 2) {
      const yesDiff = yesPrice - previousPrices[0];
      const noDiff = noPrice - previousPrices[1];

      if (yesDiff > 0.1) yesArrow = chalk.green(' ↑');
      else if (yesDiff < -0.1) yesArrow = chalk.red(' ↓');

      if (noDiff > 0.1) noArrow = chalk.green(' ↑');
      else if (noDiff < -0.1) noArrow = chalk.red(' ↓');
    }

    lines.push(
      chalk.green.bold(`YES: ${yesPrice.toFixed(1)}%`) + yesArrow
    );
    lines.push(
      chalk.red.bold(`NO:  ${noPrice.toFixed(1)}%`) + noArrow
    );
  }

  lines.push('');

  // Market info
  const volumeStr = market.volume24hr
    ? formatVolume(market.volume24hr)
    : market.volume
    ? formatVolume(market.volume)
    : 'N/A';

  lines.push(`24hr Volume: ${chalk.cyan(volumeStr)}`);

  if (market.endDate) {
    lines.push(`Ends: ${chalk.yellow(formatEndDate(market.endDate))}`);
  }

  if (market.slug) {
    lines.push('');
    lines.push(chalk.dim(`https://polymarket.com/event/${market.slug}`));
  }

  lines.push('');
  lines.push(chalk.dim('Updating every 30s... Press Ctrl+C to exit'));

  return lines.join('\n');
}

/**
 * Format price change indicator
 */
export function formatPriceChange(current: number, previous: number): string {
  const diff = current - previous;

  if (Math.abs(diff) < 0.1) {
    return chalk.dim('→');
  } else if (diff > 0) {
    return chalk.green(`↑ +${diff.toFixed(1)}%`);
  } else {
    return chalk.red(`↓ ${diff.toFixed(1)}%`);
  }
}
