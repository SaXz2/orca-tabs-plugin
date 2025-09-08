[**Orca API Documentation**](../README.md)

***

[Orca API Documentation](../modules.md) / Core Commands

# Core Commands

## Introduction

This document provides a comprehensive list of core commands available in Orca. These commands control various aspects of the application, including theme management, navigation, panel operations, editor functions, and more. Each command can be triggered through the command palette or keyboard shortcuts configured in the settings.

Commands are invoked by calling the `orca.commands.invokeCommand` function.

## Commands

### Theme and UI Commands

- `core.toggleThemeMode`

  - Description: Toggles between light and dark theme modes
  - Parameters: None

- `core.toggleClassicStyle`
  - Description: Toggles classic style interface
  - Parameters: None

### Sidebar Commands

- `core.openSidebar`

  - Description: Opens the sidebar
  - Parameters: None

- `core.closeSidebar`

  - Description: Closes the sidebar
  - Parameters: None

- `core.toggleSidebar`
  - Description: Toggles the sidebar's visibility
  - Parameters: None

### Panel Management

- `core.closePanel`

  - Description: Closes the current active panel
  - Parameters: None

- `core.closeOtherPanels`

  - Description: Closes all panels except the current one
  - Parameters: None

- `core.switchToNextPanel`

  - Description: Switches focus to the next panel
  - Parameters: None

- `core.switchToPreviousPanel`
  - Description: Switches focus to the previous panel
  - Parameters: None

### Navigation Commands

- `core.goBack`

  - Description: Navigates back in history
  - Parameters: None

- `core.goForward`

  - Description: Navigates forward in history
  - Parameters: None

- `core.goToday`

  - Description: Goes to today's journal
  - Parameters: None

- `core.goYesterday`

  - Description: Goes to yesterday's journal
  - Parameters:
    - `openAside`: boolean (optional) - If true, opens in a new panel

- `core.goTomorrow`

  - Description: Goes to tomorrow's journal
  - Parameters:
    - `openAside`: boolean (optional) - If true, opens in a new panel

- `core.openTodayInPanel`
  - Description: Opens today's journal in a new panel
  - Parameters: None

### Application Commands

- `core.closeWindow`

  - Description: Closes the current window
  - Parameters: None

- `core.quitApp`

  - Description: Quits the application
  - Parameters: None

- `core.openSettings`

  - Description: Opens the settings panel
  - Parameters: None

- `core.openSearch`

  - Description: Opens the global search
  - Parameters: None

- `core.openCommandPalette`
  - Description: Opens the command palette
  - Parameters: None

### Editor Commands

- `core.editor.toggleTOC`

  - Description: Toggles the table of contents for the current editor
  - Parameters: None

- `core.editor.goToReferrers`

  - Description: Navigates to the referrers section
  - Parameters: None

- `core.editor.goToSameKind`

  - Description: Navigates to the same tags section
  - Parameters: None

- `core.editor.goToCandidates`

  - Description: Navigates to the candidate references section
  - Parameters: None

- `core.editor.toggleFindReplace`

  - Description: Toggles the find and replace dialog
  - Parameters: None

- `core.editor.undo`

  - Description: Undoes the last editor change
  - Parameters: None

- `core.editor.redo`

  - Description: Redoes the last undone change
  - Parameters: None

- `core.editor.goTop`

  - Description: Scrolls to the top of the current editor
  - Parameters: None

- `core.editor.goBottom`

  - Description: Scrolls to the bottom of the current editor
  - Parameters: None

- `core.editor.createAndGoEmptyBlock`

  - Description: Creates a new empty block and navigates to it
  - Parameters: None

- `core.editor.stopAIStreaming`
  - Description: Stops the current AI output stream
  - Parameters: None

### Panel Operations

- `core.panel.showRecents`

  - Description: Shows recent editors in the current panel
  - Parameters: None

- `core.panel.toggleLock`

  - Description: Toggles panel locking
  - Parameters:
    - `id`: string (optional) - Panel ID, defaults to active panel

- `core.panel.toggleWideView`
  - Description: Toggles wide view mode for the panel
  - Parameters:
    - `id`: string (optional) - Panel ID, defaults to active panel

### Asset Management

- `core.assets.cleanUnused`
  - Description: Cleans up unused assets
  - Parameters: None

### S3 Sync Commands

- `core.s3.sync`
  - Description: Performs S3 synchronization
  - Parameters:
    - `interruptive`: boolean (default: true) - Shows interactive dialogs
    - `initial`: boolean (default: false) - Initial sync flag
    - `followMouse`: boolean (default: true) - Position dialogs near mouse cursor

### Layout Commands

- `core.layout._default`
  - Description: Applies the default layout
  - Parameters: None

Additional layout commands are dynamically registered based on saved layouts in settings.
