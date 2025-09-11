# Daily Tracker

A personal daily tracking system built with React and TypeScript. Track your mood, energy, productivity, sleep, exercise, goals, and habits all in one place.

## Features

- **Daily Metrics Tracking**: Track mood, energy, productivity, sleep hours, and exercise
- **Goal Management**: Set and track daily goals with completion status
- **Habit Tracking**: Monitor your daily habits and build streaks
- **Dashboard Overview**: View statistics and recent entries at a glance
- **Data Persistence**: All data is saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: CSS with modern features (backdrop-filter, CSS Grid, Flexbox)
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd daily-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Dashboard
- View your tracking statistics including total entries, current streak, and average mood
- See today's entry summary if you've already logged data
- Browse recent entries to review your progress

### Daily Entry
- Track your daily metrics using intuitive sliders and inputs
- Set goals for the day and check them off as you complete them
- Mark your habits as completed
- Add notes and reflections about your day
- Data is automatically saved to your browser's local storage

### Analytics
- Analytics dashboard is planned for future development
- Will include charts and trends to visualize your progress over time

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── DailyEntryForm.tsx # Form for creating/editing entries
│   └── Header.tsx       # Navigation header
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # localStorage persistence hook
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── utils/              # Utility functions
│   └── dateUtils.ts    # Date manipulation helpers
├── App.tsx            # Main application component
├── App.css           # Application styles
├── index.tsx         # React entry point
└── index.css         # Global styles
```

## Data Model

The application uses the following main data structures:

- **DailyEntry**: Contains mood, energy, productivity, sleep, exercise, notes, goals, and habits for a specific date
- **Goal**: Individual goals with completion status and priority
- **Habit**: Reusable habits that can be tracked across multiple days
- **HabitCheck**: Links habits to specific daily entries with completion status

## Future Enhancements

- Analytics dashboard with charts and trend analysis
- Data export/import functionality
- Habit streak tracking and statistics
- Reminder notifications
- Goal templates and categories
- Dark/light theme toggle
- Backup and sync across devices

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

This project is open source and available under the [MIT License](LICENSE).
