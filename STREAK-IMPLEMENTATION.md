# Streak Counting Implementation

This document describes the implementation of streak-counting logic for simple tasks in the Daily Tracker application.

## Overview

The streak counting system tracks consecutive "done" days for tasks by reading from localStorage daily entries and calculating streaks based on task completion status.

## Implementation Details

### 1. SimpleTask Interface

Added a new `SimpleTask` interface in `src/types/index.ts`:

```typescript
export interface SimpleTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  streakCount: number;
}
```

The `streakCount` property stores the current streak count for each task.

### 2. Streak Calculation Logic

**Core Functions in `src/utils/streakUtils.ts`:**

- `calculateTaskStreak(taskId: string, entries: DailyEntry[]): number`
  - Calculates consecutive completed days for a specific task
  - Sorts entries by date (most recent first)
  - Checks consecutive days from today backwards
  - Breaks streak if task wasn't completed on any day

- `getStreak(taskId: string): number`
  - **Main exposed function as requested**
  - Reads from localStorage and returns current streak for a task
  - Handles errors gracefully, returning 0 on failure

- `updateTaskStreaks(tasks: SimpleTask[]): SimpleTask[]`
  - Updates streak counts for an array of tasks
  - Used to refresh all streaks at once

- `getAllTaskStreaks(): Map<string, number>`
  - Returns all task streaks as a Map
  - Useful for bulk operations

- `toggleTaskAndUpdateStreak(taskId: string, completed: boolean, date?: string): number`
  - Updates task completion status in localStorage
  - Automatically recalculates and returns new streak
  - Creates daily entry if none exists for the date

### 3. React Integration

**Custom Hook (`src/hooks/useSimpleTasks.ts`):**

Provides a complete interface for managing SimpleTask objects:

```typescript
const {
  tasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTask,        // Automatically updates streaks
  refreshStreaks,    // Recalculate all streaks
  getTask,
  getTasksByStatus,
  getTasksByStreak   // Sort by streak count
} = useSimpleTasks();
```

**Component (`src/components/SimpleTasksComponent.tsx`):**

- Full UI for managing simple tasks
- Shows real-time streak counts
- Displays "Top Streaks" leaderboard
- Includes debug information
- Visual streak indicators with emojis

### 4. Data Persistence

**LocalStorage Integration:**
- Tasks stored in localStorage key: `'simpleTasks'`
- Daily entries stored in localStorage key: `'dailyEntries'`
- Automatic persistence on state changes
- Streak counts updated on each task toggle

**Data Flow:**
1. User toggles task completion
2. `toggleTaskAndUpdateStreak()` updates daily entry in localStorage
3. Streak is recalculated from all daily entries
4. Component state is updated with new streak count
5. UI reflects updated streak immediately

### 5. Streak Calculation Algorithm

The streak calculation works as follows:

```
Start from today
For each consecutive day going backwards:
  1. Check if there's an entry for that date
  2. Check if the task was completed in that entry
  3. If completed, increment streak
  4. If not completed or no entry, break streak
Return final streak count
```

**Key behaviors:**
- Streak must be consecutive from today
- Missing entries break the streak
- Tasks marked as incomplete break the streak
- Maximum possible streak is limited by available data

### 6. User Interface Updates

**New Navigation:**
- Added "Tasks" tab in Header component
- Integrated into main App routing

**Features:**
- Add/delete tasks
- Toggle completion with automatic streak updates
- Visual priority indicators (color-coded)
- Top streaks leaderboard
- Real-time vs stored streak comparison
- Debug information panel

## Usage Examples

### Basic Usage

```typescript
import { getStreak } from '../utils/streakUtils';

// Get current streak for a specific task
const currentStreak = getStreak('task-123');
console.log(`Current streak: ${currentStreak} days`);
```

### Using the Hook

```typescript
import { useSimpleTasks } from '../hooks/useSimpleTasks';

function MyComponent() {
  const { tasks, toggleTask, getTasksByStreak } = useSimpleTasks();
  
  // Toggle a task and automatically update its streak
  const handleToggle = (taskId: string) => {
    toggleTask(taskId);
  };
  
  // Get tasks sorted by streak (highest first)
  const topTasks = getTasksByStreak().slice(0, 3);
  
  return (
    <div>
      {topTasks.map(task => (
        <div key={task.id}>
          {task.title}: {task.streakCount} day streak
        </div>
      ))}
    </div>
  );
}
```

## Technical Considerations

**Performance:**
- Streak calculation is O(n) where n = number of daily entries
- Calculated on-demand, not stored redundantly
- Efficient sorting and filtering operations

**Data Integrity:**
- Handles missing localStorage data gracefully
- Error boundaries prevent crashes
- Validates data types and structure

**Extensibility:**
- Easy to add new streak types (e.g., weekly, monthly)
- Modular design allows different streak algorithms
- Clean separation between data and presentation layers

## Testing

While the environment doesn't have Node.js available for running tests, the implementation includes:

- Comprehensive error handling
- Type safety with TypeScript
- Clear function documentation
- Debug information in UI component
- Mock data structures for testing

## Integration Notes

The streak counting system integrates seamlessly with the existing Daily Tracker architecture:

- Uses existing `DailyEntry` and `Goal` structures
- Maintains backward compatibility
- Follows established patterns for localStorage usage
- Integrates with existing React component structure
