# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-11

### 🎉 Major Update: Interactive TUI Mode

This release transforms the Polymarket CLI from a simple command-line tool into a fully interactive Terminal User Interface (TUI).

### Added

- **Interactive Mode (Default)**
  - Stay-open TUI that doesn't exit after each action
  - Arrow key navigation for all selections
  - Natural search → filter → view → action workflow
  - Professional UI with clear headers and instructions
  - Smooth transitions without flicker

- **Enhanced User Experience**
  - Text input for market search
  - List selection for filters (Trending, Ending Soon, Long-Term, All)
  - Action menu (New search, Change filter, Watch market, Exit)
  - Easy exit with Ctrl+C or Exit option
  - Helpful hints and status messages

- **Multiple Filter Options**
  - Trending: Sort by 24hr volume
  - Ending Soon: Markets closing within 7 days
  - Long-Term: Markets ending in 30+ days
  - All Markets: Unfiltered results

- **Interactive Watch Mode Integration**
  - Select markets to watch from results
  - Seamlessly return to interactive mode after watching

### Changed

- **Default Behavior**: Running `poly` with no arguments now starts interactive mode (previously showed help)
- **Backward Compatibility**: All one-shot commands (`search`, `trending`, `ending`, `watch`) still work exactly as before

### Technical

- Added `inquirer` dependency for interactive prompts
- New `interactive.ts` module with main TUI loop
- Enhanced error handling with retry options
- Clear screen management for smooth UX
- TypeScript strict typing throughout

### Improved

- Market display formatting
- Filter logic and sorting
- User feedback and error messages
- Documentation (README, inline comments)

---

## [1.0.0] - 2026-02-11

### Initial Release

- Search markets by keyword
- View trending markets by 24hr volume
- View markets ending soon
- Watch mode with live updates
- Professional formatting with colors
- TypeScript implementation
- Polymarket Gamma API integration
