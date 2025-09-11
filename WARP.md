# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Daily Tracker is a personal tracking system built with React 18 and TypeScript for monitoring daily metrics including mood, energy, productivity, sleep, exercise, goals, and habits. The app uses localStorage for data persistence and features a responsive design.

## Common Development Commands

### Development Server
```bash
npm start
```
Starts the development server at http://localhost:3000

### Build Commands
```bash
npm run build
```
Creates optimized production build in `build/` directory

### Testing
```bash
npm test
```
Runs Jest tests in watch mode (note: no tests currently exist in the project)

### Linting
The project uses ESLint with React App configuration. Linting is integrated into the build process via react-scripts.

## Application Architecture

### State Management Pattern
The app uses React hooks with manual localStorage persistence rather than the custom `useLocalStorage` hook. The main state management happens in `App.tsx`:

- **entries**: Array of `DailyEntry` objects persisted to localStorage key `'dailyEntries'`
- **habits**: Array of `Habit` objects persisted to localStorage key `'habits'`
- **currentView**: Controls which component is rendered ('dashboard' | 'entry' | 'analytics')

### Data Flow Architecture
1. **App.tsx** serves as the main state container and orchestrates data flow
2. **Components** receive data and callbacks as props (no prop drilling issues due to shallow hierarchy)
3. **localStorage** acts as the persistence layer with automatic save on state changes
4. **Types** are centrally defined in `src/types/index.ts` for consistent data structures

### Component Structure
- **Header**: Navigation component that controls view switching
- **Dashboard**: Overview with statistics, today's entry summary, and recent entries list
- **DailyEntryForm**: Form for creating/editing daily entries (handles both new entries and updates)
- **App**: Root component managing global state and routing between views

### Key Data Models
- **DailyEntry**: Core entity linking date to metrics (mood, energy, productivity, sleep, exercise, notes, goals, habits)
- **Goal**: Daily goals with completion tracking and priority levels
- **Habit**: Reusable habits that can be tracked across multiple days
- **HabitCheck**: Junction entity linking habits to specific daily entries

### Storage Architecture
All data persists to browser localStorage using JSON serialization:
- Entries are saved immediately when the `entries` state changes
- Habits are saved immediately when the `habits` state changes
- No data validation or migration logic exists for localStorage data

## Code Patterns and Conventions

### TypeScript Usage
- Strict mode enabled in tsconfig.json
- All components are functional components with explicit typing
- Interfaces defined for all major data structures
- Props interfaces defined inline within component files

### React Patterns
- Functional components with hooks exclusively (no class components)
- useEffect for localStorage synchronization and data loading
- Conditional rendering for view switching (no routing library)
- Props-based communication between components

### Date Handling
The `dateUtils.ts` module provides utilities for date operations:
- `formatDate()`: Converts Date to YYYY-MM-DD string format
- `isToday()`: Checks if a date string represents today
- `daysBetween()`: Calculates days between two dates
- All dates stored as YYYY-MM-DD strings

### Component State Management
- Dashboard is read-only and receives all data as props
- DailyEntryForm handles both create and update modes via `existingEntry` prop
- No internal component state for data (only UI state like form inputs)

## Development Notes

### Current Limitations
- No test suite exists (Jest configured but no tests written)
- Analytics view is a placeholder component
- No error handling for localStorage operations (handled in custom hook but not used)
- No data validation or type checking for localStorage data
- No habit streak calculation implemented

### Architecture Decisions
- Manual localStorage integration instead of using the provided `useLocalStorage` hook
- Single-file component approach (no component subdivision)
- Date-based entry identification (one entry per date)
- Inline styles through CSS classes rather than CSS-in-JS or styled-components

### Future Development Areas
The README indicates planned features:
- Analytics dashboard with charts and trends
- Data export/import functionality  
- Habit streak tracking and statistics
- Reminder notifications
- Goal templates and categories

## File Organization

```
src/
├── components/          # React UI components
│   ├── Dashboard.tsx    # Main overview with stats and recent entries
│   ├── DailyEntryForm.tsx # Form for daily entry creation/editing
│   └── Header.tsx       # Navigation header
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts # localStorage persistence hook (unused)
├── types/               # TypeScript type definitions
│   └── index.ts         # All application types
├── utils/               # Utility functions  
│   └── dateUtils.ts     # Date manipulation helpers
├── App.tsx             # Main application container
├── App.css            # Application styles
├── index.tsx          # React entry point
└── index.css          # Global styles
```

## Technology Stack

- **Frontend**: React 18 with TypeScript 4.9
- **Styling**: CSS with modern features (backdrop-filter, CSS Grid, Flexbox)
- **State Management**: React hooks with localStorage persistence  
- **Build Tool**: Create React App with react-scripts 5.0.1
- **Development**: No additional build tools, linting via ESLint React App config
