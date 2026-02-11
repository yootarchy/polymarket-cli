# Interactive TUI Mode

## Overview

The Polymarket CLI now includes a fully interactive TUI (Terminal User Interface) mode that provides arrow-key navigation and stays open until you quit.

## Launch Interactive Mode

Simply run the CLI without any arguments:

```bash
node dist/index.js
```

Or if installed globally:

```bash
poly
```

## Features

### Main Menu

When you launch interactive mode, you'll see a main menu with these options:

1. **🔍 Search events by tag** - Search for events using keywords/tags
2. **🔥 Trending markets** - View top markets by 24-hour volume
3. **⏰ Ending soon** - View markets ending within 7 days
4. **🔄 Refresh cache** - Update local event cache from Polymarket API
5. **❌ Quit** - Exit interactive mode

### Navigation

- **↑↓ Arrow keys** - Move between menu items
- **Enter** - Select an option
- **Q** or **Ctrl+C** - Quit from anywhere

### Search Events by Tag

1. Select "Search events by tag" from main menu
2. Enter your search query (keyword or tag)
3. Browse results using arrow keys
4. Select an event to view its markets
5. View market details
6. Navigate back to search or main menu

### View Trending Markets

1. Select "Trending markets" from main menu
2. Browse top markets sorted by 24-hour trading volume
3. Select a market to see detailed information
4. Navigate back to the list or main menu

### View Markets Ending Soon

1. Select "Ending soon" from main menu
2. Browse markets ending within the next 7 days
3. Select a market to see detailed information
4. Navigate back to the list or main menu

### Refresh Cache

The CLI uses a local cache for fast event searching. To update it:

1. Select "Refresh cache" from main menu
2. Wait ~30 seconds while it fetches latest events
3. Returns to main menu when complete

## User Experience

### Persistent Session

Unlike the command-line mode (which runs one command and exits), interactive mode **stays open** until you explicitly quit. This means:

- You can perform multiple searches
- Browse different market categories
- Switch between views seamlessly
- No need to relaunch the app

### Clean Interface

- Screen clears between views for a clean experience
- Consistent header shows current mode
- Context-aware navigation options
- Helpful prompts and messages

### Error Handling

- Network errors display clearly with retry options
- Invalid inputs are caught with helpful messages
- Graceful exit on Ctrl+C
- Cache building happens automatically if needed

## Command-Line Mode Still Works

Interactive mode is an **addition**, not a replacement. All original commands still work:

```bash
# Search markets
node dist/index.js search bitcoin

# View trending
node dist/index.js trending

# View ending soon
node dist/index.js ending

# Refresh cache
node dist/index.js refresh

# Watch a market
node dist/index.js watch <market-id>
```

## Technical Details

### Implementation

- **File**: `src/interactive.ts`
- **Library**: `inquirer` v8 for TUI components
- **Entry point**: Detected in `src/index.ts` when no args provided
- **Arrow keys**: Native support through inquirer's list prompts

### Code Structure

```typescript
// Main loop - stays open until quit
while (true) {
  const action = await showMainMenu();
  
  switch (action) {
    case 'search': await searchEventsByTag(); break;
    case 'trending': await showTrendingMarkets(); break;
    case 'ending': await showEndingSoon(); break;
    case 'refresh': await refreshCache(); break;
    case 'quit': process.exit(0);
  }
}
```

### No-Args Detection

```typescript
// In src/index.ts
if (process.argv.length === 2) {
  startInteractiveMode().catch((error) => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
} else {
  program.parse(process.argv);
}
```

## Development

### Build

```bash
npm run build
```

### Test

Run the verification script:

```bash
./test-tui.sh
```

Or test manually:

```bash
node dist/index.js
```

## Comparison: Before vs After

### Before (Command Mode Only)

```bash
$ node dist/index.js search bitcoin
[Shows results and exits]

$ node dist/index.js trending
[Shows results and exits]
```

### After (Interactive Mode)

```bash
$ node dist/index.js
[Launches TUI]

Main menu → Search → View results → Select event → 
View markets → Back → Different search → Trending → 
View market → Back → Quit
```

## Benefits

1. **Smoother workflow** - No need to re-run commands
2. **Better exploration** - Easy to browse and compare markets
3. **Lower friction** - Stay in one session, navigate naturally
4. **More intuitive** - Arrow keys feel natural for browsing
5. **Flexible** - Both modes available for different use cases

---

**Quick start:** Run `node dist/index.js` with no arguments and use arrow keys to navigate!
