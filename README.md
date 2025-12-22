# Prompt Monitor

A Chrome extension that monitors ChatGPT prompts for sensitive data (email addresses) and provides real-time anonymization options before requests are sent.

**Target Platform**: ChatGPT (https://chatgpt.com/*)
**Version**: 1.0.0 | **Type**: Manifest V3

## Architecture

### Three-Layer Design

**Backend** (`src/backend/`) - Service worker handling request interception, validation, and storage
**Frontend** (`src/frontend/`) - React-based modal UI injected into ChatGPT with Context API state management
**Shared** (`src/shared/`) - Common types, constants, utilities, and cross-browser abstractions

### Communication Flow

- **window.postMessage()**: Page context ↔ Content script (issue detection)
- **browser.runtime.sendMessage()**: Content script ↔ Background worker (user actions)

### Design Patterns

Handler-based message routing • Dependency injection for testability • Event-driven async flow • React Context state management

## Cross-Browser Compatibility

Uses **webextension-polyfill** for unified API across Chrome, Firefox, and Edge. All browser-specific APIs (storage, runtime, messaging) are abstracted via `BrowserAPI` class in `src/shared/utils/runtime.ts`.

## Features & User Actions

### Real-Time Detection

- Intercepts all POST requests to ChatGPT API endpoints
- Scans request bodies for email patterns using regex
- Blocks request until user makes a decision
- Non-intrusive: Only activates when sensitive data is detected

### User Action Options

When emails are detected, users can choose:

**1. Mask & Send**
- Replaces emails with placeholders: `[EMAIL_1]`, `[EMAIL_2]`, etc.
- Sends anonymized version of the prompt
- Original request continues with modifications

**2. Dismiss**
- Suppresses warnings for detected emails for 24 hours
- Allows request to proceed unchanged
- Email tracking persisted in history with expiry timestamp

**3. Cancel**
- Blocks the request entirely
- No data sent to ChatGPT
- User can modify prompt and retry

### History Tracking

- Persistent log of all detected emails
- Status tracking: `DISMISSED`, `MASKED`, `CANCELLED`
- Displays remaining dismissal time
- Accessible via History tab in modal

### Email Anonymization

Emails are replaced with sequential placeholders:
```
"Contact john@example.com or jane@test.com"
↓
"Contact [EMAIL_1] or [EMAIL_2]"
```

## Project Structure

```
src/
├── backend/                          # Service worker & background logic
│   ├── services/                     # Request interception, validation, storage
│   └── background.worker.ts          # Entry point
│
├── frontend/                         # React UI & content script
│   ├── components/Modal/             # Main UI (Issues, History tabs)
│   ├── context/AppContext.tsx        # State management
│   └── content.tsx                   # Entry point
│
├── shared/                           # Cross-layer utilities
│   └── utils/runtime.ts              # Browser API abstraction
│
└── __tests__/                        # Jest test suites
```

## Data Flow

```
1. FetchInterceptorService wraps window.fetch
2. POST request to ChatGPT → RequestValidatorService scans for emails
3. If detected → Request blocked → postMessage to content script
4. Modal displays → User selects action (Mask/Dismiss/Cancel)
5. Action sent to background worker → Handler processes
6. Response → Request continues (modified/unchanged/aborted)
```

**Message Flow**: Page Context → postMessage → Content Script → runtime.sendMessage → Background Worker → StorageService

## Tech Stack

**Core**: TypeScript 5.3 • React 18.2 • Webpack 5.89 • Jest 30.2 • webextension-polyfill 0.12

**Build Tools**: ts-loader • css-loader • mini-css-extract-plugin • copy-webpack-plugin

## Development Setup

**Prerequisites**: Node.js v16+ • npm/pnpm • Chrome/Edge/Firefox

**Installation**: `git clone <repo> && cd bw-extension && npm install`

**Commands**:
- `npm run dev` - Development build with watch mode
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run test:watch` - Watch mode testing

**Build Output**: `dist/` contains `background.js`, `content.js`, `content.css`, `inject-fetch-interceptor.js`, `manifest.json`

**Workflow**: Edit in `src/` → `npm run dev` → Reload extension → Test on chatgpt.com

## Configuration

**Email Detection**: Regex pattern in `src/backend/constants/index.ts`
```typescript
EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
```

**Monitored Endpoints**: `/backend-api/conversation` (configurable in constants)

**Dismissal Duration**: 24 hours • Expired dismissals auto-filtered • Request proceeds if all emails dismissed

**Permissions**: `storage` (persistent data) • `activeTab` (ChatGPT access)

## Storage & Persistence

**Data Model**: Issues stored in `browser.storage.local` with schema: `{ id, email, status, timestamp, dismissedUntil? }`

**Status Types**: `DISMISSED` • `MASKED` • `CANCELLED`

**Storage**: ~5MB limit (Chrome) • Per-extension scope • Survives browser restarts

## Extension Loading

### Installation

**Chrome/Edge**: `chrome://extensions/` → Enable Developer Mode → Load unpacked → Select `dist/`

**Firefox**: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → Select `dist/manifest.json`

### Testing

Visit https://chatgpt.com → Type message with email (e.g., "test@example.com") → Send → Modal appears with detected email

### Updates

After code changes: `npm run build` → Reload extension → Refresh ChatGPT page

### TODO 
    - firefox problems with saving data and state