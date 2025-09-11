# Daily Tracker - Code Architecture Overview

## 📁 Project Structure
```
daily-tracker/
├── src/
│   ├── components/         # React components
│   │   ├── Analytics.tsx       # 706 lines - Data visualization & insights
│   │   ├── DailyEntryForm.tsx  # 276 lines - Main data input form
│   │   ├── Dashboard.tsx       # 135 lines - Overview and statistics
│   │   ├── Header.tsx          # 64 lines - Navigation component
│   │   ├── SimpleTasksComponent.tsx # 255 lines - Task management
│   │   ├── SummaryModal.tsx    # 438 lines - AI insights display
│   │   └── SupplementManager.tsx # 501 lines - Medication tracking
│   ├── hooks/              # Custom React hooks
│   │   ├── useLocalStorage.ts  # Persistent state management
│   │   ├── useSimpleTasks.ts   # Task management logic
│   │   └── useSupplements.ts   # Supplement tracking logic
│   ├── types/              # TypeScript definitions
│   │   └── index.ts           # All interface definitions
│   ├── utils/              # Utility functions
│   │   ├── analyticsUtils.ts   # Data processing for charts
│   │   ├── dateUtils.ts       # Date manipulation helpers
│   │   ├── exportUtils.ts     # Data export functionality
│   │   ├── openAIUtils.ts     # AI integration utilities
│   │   └── sampleDataGenerator.ts # Test data creation
│   ├── App.tsx            # Main application component
│   └── App.css            # Dark theme styling (586 lines)
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔧 Key Technologies
- **React 18** with TypeScript
- **Recharts** for data visualization
- **CSS3** with custom dark theme
- **localStorage** for data persistence
- **OpenAI API** integration ready

## 📊 Component Breakdown

### 1. Analytics Component (706 lines)
- Interactive charts using Recharts
- Data processing and visualization
- Export functionality (JSON/CSV)
- AI summary generation interface
- Sample data generation for testing

### 2. DailyEntryForm Component (276 lines)
- Mood, energy, productivity sliders (1-10 scale)
- Sleep tracking with decimal precision
- Exercise checkbox
- Dynamic goal management
- Habit tracking integration
- Notes section for daily reflections

### 3. Dashboard Component (135 lines)
- Statistics overview (total entries, streak, averages)
- Today's entry summary
- Recent entries list
- Clean metric display cards

### 4. SupplementManager Component (501 lines)
- Flexible scheduling (daily, weekly, as-needed)
- Conditional logic engine
- Visual completion tracking
- Inventory management

## 🎨 Styling Architecture
- **586 lines of CSS** implementing professional dark theme
- Color palette: `#0a0a0a` (background) to `#ffffff` (text)
- Consistent 6px border radius
- Smooth transitions and hover effects
- Responsive design for all screen sizes

## 🔗 Data Flow
1. **Input**: DailyEntryForm captures user data
2. **Storage**: useLocalStorage hook persists to browser
3. **Processing**: Utils functions transform data for visualization
4. **Display**: Analytics component renders charts and insights
5. **Export**: Users can download complete datasets

## 🤖 AI Integration
- OpenAI GPT-4 ready for weekly summaries
- Privacy-first: only processes data when explicitly requested
- Modal interface for clean insight presentation
- Backend API documentation included

## 💾 Data Model
All data stored locally using TypeScript interfaces:
- DailyEntry: Core tracking data
- Goal: Task management
- Habit: Recurring activities
- Supplement: Medication tracking

## 🚀 Deployment Ready
- Production build generated (`npm run build`)
- 169KB main bundle (optimized)
- Static deployment compatible
- No server requirements (except optional AI backend)
