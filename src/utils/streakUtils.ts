import { DailyEntry, SimpleTask } from '../types';
import { formatDate } from './dateUtils';

/**
 * Calculate consecutive "done" days for a specific task
 * @param taskId - The ID of the task to calculate streak for
 * @param entries - Array of daily entries from localStorage
 * @returns The current streak count for the task
 */
export function calculateTaskStreak(taskId: string, entries: DailyEntry[]): number {
  // Sort entries by date in descending order (most recent first)
  const sortedEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - streak);
    
    // Check if this entry is for the expected consecutive date
    if (formatDate(entryDate) !== formatDate(expectedDate)) {
      break;
    }
    
    // Check if the task was completed in this entry
    // Look for the task in goals array (assuming SimpleTask maps to Goal)
    const taskCompleted = entry.goals.some(goal => 
      goal.id === taskId && goal.completed
    );
    
    if (taskCompleted) {
      streak++;
    } else {
      break; // Streak is broken if task wasn't completed
    }
  }
  
  return streak;
}

/**
 * Get current streak for a specific task ID
 * @param taskId - The ID of the task
 * @returns The current streak count
 */
export function getStreak(taskId: string): number {
  try {
    const savedEntries = localStorage.getItem('dailyEntries');
    if (!savedEntries) {
      return 0;
    }
    
    const entries: DailyEntry[] = JSON.parse(savedEntries);
    return calculateTaskStreak(taskId, entries);
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

/**
 * Update streak counts for all tasks in a SimpleTask array
 * @param tasks - Array of SimpleTask objects
 * @returns Updated array with current streak counts
 */
export function updateTaskStreaks(tasks: SimpleTask[]): SimpleTask[] {
  try {
    const savedEntries = localStorage.getItem('dailyEntries');
    if (!savedEntries) {
      return tasks.map(task => ({ ...task, streakCount: 0 }));
    }
    
    const entries: DailyEntry[] = JSON.parse(savedEntries);
    
    return tasks.map(task => ({
      ...task,
      streakCount: calculateTaskStreak(task.id, entries)
    }));
  } catch (error) {
    console.error('Error updating task streaks:', error);
    return tasks;
  }
}

/**
 * Calculate streaks for all unique tasks across all daily entries
 * @returns Map of taskId to streak count
 */
export function getAllTaskStreaks(): Map<string, number> {
  const streakMap = new Map<string, number>();
  
  try {
    const savedEntries = localStorage.getItem('dailyEntries');
    if (!savedEntries) {
      return streakMap;
    }
    
    const entries: DailyEntry[] = JSON.parse(savedEntries);
    
    // Get all unique task IDs from all entries
    const allTaskIds = new Set<string>();
    entries.forEach(entry => {
      entry.goals.forEach(goal => {
        allTaskIds.add(goal.id);
      });
    });
    
    // Calculate streak for each unique task
    allTaskIds.forEach(taskId => {
      const streak = calculateTaskStreak(taskId, entries);
      streakMap.set(taskId, streak);
    });
    
    return streakMap;
  } catch (error) {
    console.error('Error getting all task streaks:', error);
    return streakMap;
  }
}

/**
 * Update a task's completion status and recalculate its streak
 * @param taskId - ID of the task being toggled
 * @param completed - New completion status
 * @param date - Date for the entry (defaults to today)
 * @returns Updated streak count for the task
 */
export function toggleTaskAndUpdateStreak(
  taskId: string, 
  completed: boolean, 
  date: string = formatDate(new Date())
): number {
  try {
    // Get current entries
    const savedEntries = localStorage.getItem('dailyEntries');
    const entries: DailyEntry[] = savedEntries ? JSON.parse(savedEntries) : [];
    
    // Find or create entry for the specified date
    let entryIndex = entries.findIndex(entry => entry.date === date);
    
    if (entryIndex === -1) {
      // Create new entry if it doesn't exist
      const newEntry: DailyEntry = {
        id: Date.now().toString(),
        date: date,
        mood: 5,
        energy: 5,
        productivity: 5,
        sleep: 8,
        exercise: false,
        notes: '',
        goals: [],
        habits: []
      };
      entries.push(newEntry);
      entryIndex = entries.length - 1;
    }
    
    // Update or add the task in the goals array
    const goalIndex = entries[entryIndex].goals.findIndex(goal => goal.id === taskId);
    
    if (goalIndex !== -1) {
      entries[entryIndex].goals[goalIndex].completed = completed;
    } else {
      // Add new goal/task if it doesn't exist
      entries[entryIndex].goals.push({
        id: taskId,
        title: 'Simple Task', // Default title - should be updated with actual task data
        description: '',
        completed: completed,
        priority: 'medium'
      });
    }
    
    // Save updated entries back to localStorage
    localStorage.setItem('dailyEntries', JSON.stringify(entries));
    
    // Calculate and return updated streak
    return calculateTaskStreak(taskId, entries);
  } catch (error) {
    console.error('Error toggling task and updating streak:', error);
    return 0;
  }
}
