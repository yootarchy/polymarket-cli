#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { searchCommand } from './commands/search';
import { watchCommand } from './commands/watch';
import { trendingCommand } from './commands/trending';
import { endingCommand } from './commands/ending';
import { refreshCommand } from './commands/refresh';
import { startInteractiveMode } from './interactive';

const program = new Command();

// CLI metadata
program
  .name('poly')
  .description(chalk.cyan('🎲 Polymarket CLI - Quick market lookups and monitoring'))
  .version('1.0.0');

// Search command
program
  .command('search <query>')
  .description('Search markets by keyword')
  .action(async (query: string) => {
    await searchCommand(query);
  });

// Watch command
program
  .command('watch <market-id>')
  .description('Monitor a specific market with live updates')
  .action(async (marketId: string) => {
    await watchCommand(marketId);
  });

// Trending command
program
  .command('trending')
  .description('Show top trending markets by 24hr volume')
  .action(async () => {
    await trendingCommand();
  });

// Ending command
program
  .command('ending')
  .description('Show markets ending soon (<7 days)')
  .action(async () => {
    await endingCommand();
  });

// Refresh command
program
  .command('refresh')
  .description('Refresh the local event cache from Polymarket API')
  .action(async () => {
    await refreshCommand();
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('\n❌ Invalid command'));
  console.log(chalk.dim('Run "poly --help" for usage information'));
  process.exit(1);
});

// If no command provided, start interactive mode
if (process.argv.length === 2) {
  startInteractiveMode().catch((error) => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
} else {
  // Parse arguments for other commands
  program.parse(process.argv);
}
