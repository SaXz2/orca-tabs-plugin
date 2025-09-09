# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Building and Development
- `npm install` - Install dependencies
- `npm run build` - Build the plugin for production (runs TypeScript compiler + Vite build)
- `npm run dev` - Start development server with hot reload
- `npm run preview` - Preview production build locally

### Type Checking
- `npx tsc --noEmit` - Check TypeScript types without emitting files
- `npx tsc` - Full TypeScript compilation (emits to dist/)

## Project Architecture

### High-Level Structure
This is an Orca Note plugin that provides browser-style tabs for single-panel mode. The plugin renders a tab bar at the top of `.orca-panel` elements to display all cached pages (`.orca-hideable` elements) within the current panel and allows switching between them.

### Core Components

**Main Entry Point**: `src/main.ts`
- Plugin lifecycle management (`load`, `unload` functions)
- Tab UI setup and teardown (`setupTabUI`, `teardownTabUI`)
- Tab rendering logic (`renderTabsForPanel`)
- Block property reading for colors and icons
- Command registration for tab functionality

**Type Definitions**: `src/orca.d.ts`
- Orca API type definitions for blocks, properties, and backend APIs
- Plugin-specific interfaces like `OpenTabInfo`

**Localization**: `src/libs/l10n.ts` and `src/translations/zhCN.ts`
- Internationalization support with Chinese translations

### Key Functionality Areas

**Tab Management System**:
- Automatically detects and monitors `.orca-hideable` elements within panels
- Creates `OpenTabInfo` objects with block IDs, titles, colors, and icons
- Renders clickable tab buttons with visual feedback
- Handles tab switching by toggling visibility of hideable elements

**Block Property Integration**:
- Reads `_color` property from BlockProperty to set tab background colors
- Reads `_icon` property from BlockProperty to display tab icons
- Automatically calculates contrasting text colors using `getContrastTextColor`
- Applies 50% transparency to background colors using `hexToRgba`

**UI State Management**:
- Only enables in single-panel mode (disables automatically in multi-panel layouts)
- Ignores content within `.orca-popup` elements to prevent interference with floating windows
- Provides draggable floating tab bar with position persistence
- Auto-adapts to light/dark theme modes

**Backend API Integration**:
- Uses `orca.invokeBackend("get-blocks")` to fetch block data
- Leverages existing Orca state through `orca.state.blocks`
- Properly handles block IDs and property extraction with type casting

### Build Configuration
- **TypeScript**: ESNext target with strict mode, React JSX support
- **Vite**: ES module output with external dependencies (React, Valtio)
- **Output**: Single `dist/index.js` file in ES format
- **Globals**: React and Valtio are treated as external globals

## Important Implementation Details

### Block Property Reading
Block properties are accessed through the `properties` array on block objects. Due to TypeScript type limitations, use `(block as any).properties` when accessing custom properties like `_color` and `_icon`:

```typescript
const colorProp = (block as any).properties.find((p: any) => p.name === "_color" && p.type === 1);
if (colorProp) info.color = colorProp.value;
```

### Panel Detection Logic
The plugin uses sophisticated DOM querying to identify valid panels and hideable elements:
- Main panels: `.orca-panel` (excluding those inside `.orca-popup`)
- Hideable content: `.orca-hideable` (elements that can be tabbed)
- Popup detection: Uses `isInsidePopup()` helper to avoid interference

### Theme Adaptation
Styles are injected via a `<style>` tag with media queries for theme adaptation:
- Light mode: Semi-transparent dark backgrounds, brighter active tabs
- Dark mode: Semi-transparent light backgrounds, enhanced contrast active tabs
- Custom background color support: Automatic contrast text color calculation

### Position Persistence
Tab bar position is saved using both Orca plugin data API and localStorage fallback:
- Primary: `orca.plugins.setData(pluginName, STORAGE_KEY_BAR_POS, pos)`
- Fallback: `localStorage.setItem` for faster initial restore
- Reset command available in plugin settings

### Command System
The plugin registers several commands for automation and debugging:
- `orca-tabs-plugin.tabs.list` - List current active panel tabs
- `orca-tabs-plugin.tabs.switchNext/Prev` - Navigate tabs
- `orca-tabs-plugin.tabs.closeOthers` - Close other panels

## Development Notes

### Type Safety Considerations
- Use `as any` casting when accessing Orca block properties not in official types
- Block objects from `orca.state.blocks` may have limited type definitions
- Backend API responses should be properly typed but may require assertion

### Performance Optimizations
- Debounced refresh scheduling (`scheduleRefresh`) to prevent excessive re-renders
- MutationObserver with subtree monitoring for efficient DOM change detection
- Filtering of valid block IDs to prevent "ghost tabs" from appearing
- Popup content exclusion to avoid unnecessary UI updates

### Testing Approach
- Test in both single-panel and multi-panel layouts
- Verify popup content (like block previews) doesn't interfere with tab bar
- Test theme switching between light and dark modes
- Validate block property reading (colors, icons) from actual Orca blocks
- Test draggable behavior and position persistence

### Plugin Lifecycle
- `load()`: Initialize UI, register commands, setup localization
- `unload()`: Clean up observers, remove UI elements, unregister commands
- Error handling throughout to prevent plugin crashes from affecting Orca