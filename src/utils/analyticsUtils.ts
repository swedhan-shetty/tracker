import { DailyEntry, Goal, SimpleTask, SupplementTask } from '../types';
import { formatDate, daysBetween } from './dateUtils';

export interface TaskCompletionData {
  date: string;
  displayDate: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  goalTasks: number;
  supplementTasks: number;
  simpleTasks: number;
}

export interface TaskTypeData {
  name: string;
  count: number;
  color: string;
}

export interface WeeklyTaskData {
  taskName: string;
  completed: number;
  color: string;
}

/**
 * Get daily entries for the past N days
 * @param days - Number of days to fetch (default: 7)
 * @returns Array of daily entries
 */
export function getDailyEntriesForPastDays(days: number = 7): DailyEntry[] {
  try {
    const savedEntries = localStorage.getItem('dailyEntries');
    if (!savedEntries) return [];
    
    const entries: DailyEntry[] = JSON.parse(savedEntries);
    
    // Get date range for the past N days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    
    // Filter entries within the date range
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
    
    // Sort by date (oldest first)
    return filteredEntries.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching daily entries:', error);
    return [];
  }
}

/**
 * Get task completion data for the past week
 * @returns Array of task completion data by date
 */
export function getWeeklyTaskCompletion(): TaskCompletionData[] {
  const entries = getDailyEntriesForPastDays(7);
  const today = new Date();
  
  // Generate array for past 7 days, including days without entries
  const weeklyData: TaskCompletionData[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    
    // Find entry for this date
    const entry = entries.find(e => e.date === dateStr);
    
    if (entry) {
      const goalTasks = entry.goals.length;
      const completedGoals = entry.goals.filter(g => g.completed).length;
      
      // Get supplement tasks (if any exist)
      const supplementTasks = getSupplementTasksForDate(dateStr);
      const completedSupplements = supplementTasks.filter(s => s.isCompleted).length;
      
      // Get simple tasks (if any exist)
      const simpleTasks = getSimpleTasksForDate(dateStr);
      const completedSimpleTasks = simpleTasks.filter(s => s.completed).length;
      
      const totalTasks = goalTasks + supplementTasks.length + simpleTasks.length;
      const completedTasks = completedGoals + completedSupplements + completedSimpleTasks;
      
      weeklyData.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        goalTasks: completedGoals,
        supplementTasks: completedSupplements,
        simpleTasks: completedSimpleTasks
      });
    } else {
      // No entry for this date
      weeklyData.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        goalTasks: 0,
        supplementTasks: 0,
        simpleTasks: 0
      });
    }
  }
  
  return weeklyData;
}

/**
 * Get supplement tasks for a specific date
 * @param date - Date string
 * @returns Array of supplement tasks
 */
function getSupplementTasksForDate(date: string): SupplementTask[] {
  try {
    const savedSupplements = localStorage.getItem('supplements');
    if (!savedSupplements) return [];
    
    const supplements: SupplementTask[] = JSON.parse(savedSupplements);
    
    // For now, we'll return all active supplements for the date
    // In a more sophisticated implementation, we'd track completion per date
    return supplements.filter(s => s.isActive);
  } catch (error) {
    console.error('Error fetching supplement tasks:', error);
    return [];
  }
}

/**
 * Get simple tasks for a specific date
 * @param date - Date string  
 * @returns Array of simple tasks
 */
function getSimpleTasksForDate(date: string): SimpleTask[] {
  try {
    const savedTasks = localStorage.getItem('simpleTasks');
    if (!savedTasks) return [];
    
    const tasks: SimpleTask[] = JSON.parse(savedTasks);
    
    // For now, we'll return all tasks
    // In a more sophisticated implementation, we'd track completion per date
    return tasks;
  } catch (error) {
    console.error('Error fetching simple tasks:', error);
    return [];
  }
}

/**
 * Get task completion data by task type for the past week
 * @returns Array of task type completion data
 */
export function getWeeklyTasksByType(): TaskTypeData[] {
  const entries = getDailyEntriesForPastDays(7);
  
  let totalGoals = 0;
  let totalSupplements = 0;
  let totalSimpleTasks = 0;
  
  entries.forEach(entry => {
    totalGoals += entry.goals.filter(g => g.completed).length;
  });
  
  // Get supplement and simple task data (simplified for now)
  try {
    const savedSupplements = localStorage.getItem('supplements');
    if (savedSupplements) {
      const supplements: SupplementTask[] = JSON.parse(savedSupplements);
      totalSupplements = supplements.filter(s => s.isCompleted).length * entries.length;
    }
    
    const savedTasks = localStorage.getItem('simpleTasks');
    if (savedTasks) {
      const tasks: SimpleTask[] = JSON.parse(savedTasks);
      totalSimpleTasks = tasks.filter(t => t.completed).length * entries.length;
    }
  } catch (error) {
    console.error('Error processing task type data:', error);
  }
  
  return [
    {
      name: 'Goals',
      count: totalGoals,
      color: '#8884d8'
    },
    {
      name: 'Supplements',
      count: totalSupplements,
      color: '#82ca9d'
    },
    {
      name: 'Simple Tasks',
      count: totalSimpleTasks,
      color: '#ffc658'
    }
  ];
}

/**
 * Get individual task completion data for bar chart
 * @returns Array of task completion data for chart
 */
export function getTaskCompletionChartData(): WeeklyTaskData[] {
  const entries = getDailyEntriesForPastDays(7);
  
  // Aggregate task completions by task name
  const taskCompletions: { [key: string]: number } = {};
  
  entries.forEach(entry => {
    entry.goals.forEach(goal => {
      if (goal.completed) {
        taskCompletions[goal.title] = (taskCompletions[goal.title] || 0) + 1;
      }
    });
  });
  
  // Convert to chart data format
  const chartData: WeeklyTaskData[] = Object.entries(taskCompletions)
    .map(([taskName, completed], index) => ({
      taskName,
      completed,
      color: getTaskColor(index)
    }))
    .sort((a, b) => b.completed - a.completed) // Sort by completion count (descending)
    .slice(0, 10); // Limit to top 10 tasks
  
  return chartData;
}

/**
 * Get color for task based on index
 * @param index - Task index
 * @returns Color string
 */
function getTaskColor(index: number): string {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00bcd4',
    '#e91e63', '#4caf50', '#ff9800', '#9c27b0', '#f44336'
  ];
  return colors[index % colors.length];
}

/**
 * Get completion statistics for the dashboard
 * @returns Statistics object
 */
export function getCompletionStatistics() {
  const weeklyData = getWeeklyTaskCompletion();
  const totalDays = weeklyData.length;
  const activeDays = weeklyData.filter(day => day.totalTasks > 0).length;
  
  const totalTasks = weeklyData.reduce((sum, day) => sum + day.totalTasks, 0);
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completedTasks, 0);
  
  const avgCompletionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
  const avgTasksPerDay = activeDays > 0 ? totalTasks / activeDays : 0;
  
  return {
    totalDays,
    activeDays,
    totalTasks,
    totalCompleted,
    avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
    avgTasksPerDay: Math.round(avgTasksPerDay * 10) / 10,
    bestDay: weeklyData.reduce((best, day) => 
      day.completionRate > best.completionRate ? day : best
    , weeklyData[0])
  };
}

/**
 * Get daily completion trend for the past week
 * @returns Array of completion rates by day
 */
export function getDailyCompletionTrend(): { date: string; completionRate: number; displayDate: string }[] {
  const weeklyData = getWeeklyTaskCompletion();
  
  return weeklyData.map(day => ({
    date: day.date,
    displayDate: day.displayDate,
    completionRate: Math.round(day.completionRate * 10) / 10
  }));
}
