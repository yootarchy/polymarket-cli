# Contributing to Polymarket CLI

Thanks for your interest in contributing! This tool is designed to be simple, fast, and useful.

## Development Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd polymarket-cli

# Install dependencies
npm install

# Run in dev mode
npm run dev search "bitcoin"

# Build
npm run build

# Test the built version
node dist/index.js search "test"
```

## Code Style

- **TypeScript** - Use types for everything
- **Clean code** - Prefer readability over cleverness
- **Error handling** - Always handle API failures gracefully
- **User feedback** - Show spinners, clear error messages

## Adding a New Command

1. Create a new file in `src/commands/your-command.ts`
2. Export an async function that does the work
3. Add the command to `src/index.ts`
4. Update README.md with usage examples
5. Build and test

## Pull Request Process

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Build and test (`npm run build && node dist/index.js --help`)
5. Commit with clear message
6. Push and open a PR

## Ideas for Contributions

- **Portfolio tracking** - Save favorite markets
- **Notifications** - Alert when odds change
- **Charts** - ASCII charts for price history
- **Filters** - More search options (category, volume, etc.)
- **Export** - Save results to JSON/CSV
- **Tests** - Unit tests for API and formatters
- **Docs** - More examples, video demos

## Questions?

Open an issue or reach out! Let's make this tool awesome together.
