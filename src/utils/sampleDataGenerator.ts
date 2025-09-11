import { DailyEntry, Goal, SimpleTask, SupplementTask } from '../types';
import { formatDate } from './dateUtils';

/**
 * Generate sample daily entries for testing analytics
 * @param days - Number of days to generate (default: 7)
 * @returns Array of sample daily entries
 */
export function generateSampleDailyEntries(days: number = 7): DailyEntry[] {
  const entries: DailyEntry[] = [];
  const today = new Date();
  
  // Sample goal templates
  const goalTemplates = [
    'Read for 30 minutes',
    'Exercise',
    'Drink 8 glasses of water',
    'Meditate for 10 minutes',
    'Write in journal',
    'Complete work project',
    'Call family/friends',
    'Take vitamins',
    'Practice gratitude',
    'Go for a walk'
  ];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    
    // Generate random goals for this day (3-6 goals per day)
    const numGoals = 3 + Math.floor(Math.random() * 4);
    const dayGoals: Goal[] = [];
    const shuffledGoals = [...goalTemplates].sort(() => Math.random() - 0.5);
    
    for (let j = 0; j < numGoals; j++) {
      const completed = Math.random() > 0.3; // 70% completion rate
      dayGoals.push({
        id: `goal-${dateStr}-${j}`,
        title: shuffledGoals[j] || `Goal ${j + 1}`,
        description: '',
        completed,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      });
    }
    
    // Generate entry with some variability
    const entry: DailyEntry = {
      id: `entry-${dateStr}`,
      date: dateStr,
      mood: 3 + Math.floor(Math.random() * 6), // 3-8 range
      energy: 3 + Math.floor(Math.random() * 6), // 3-8 range
      productivity: 3 + Math.floor(Math.random() * 6), // 3-8 range
      sleep: 5 + Math.floor(Math.random() * 4), // 5-8 hours
      exercise: Math.random() > 0.4, // 60% exercise rate
      notes: i % 3 === 0 ? `Sample notes for ${dateStr}` : '',
      goals: dayGoals,
      habits: [] // Simplified for this example
    };
    
    entries.push(entry);
  }
  
  return entries.reverse(); // Return in chronological order
}

/**
 * Generate sample simple tasks for testing
 * @returns Array of sample simple tasks
 */
export function generateSampleSimpleTasks(): SimpleTask[] {
  const taskTemplates = [
    'Check emails',
    'Update project status',
    'Review documents',
    'Attend team meeting',
    'Submit report'
  ];
  
  return taskTemplates.map((title, index) => ({
    id: `simple-task-${index}`,
    title,
    description: `Sample simple task: ${title}`,
    completed: Math.random() > 0.4, // 60% completion rate
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    streakCount: Math.floor(Math.random() * 7)
  }));
}

/**
 * Generate sample supplements for testing
 * @returns Array of sample supplements
 */
export function generateSampleSupplements(): SupplementTask[] {
  const supplementTemplates = [
    { name: 'Vitamin D3', dosage: '1000 IU', timing: 'morning' as const },
    { name: 'Omega-3', dosage: '500mg', timing: 'with_meal' as const },
    { name: 'Magnesium', dosage: '200mg', timing: 'evening' as const },
    { name: 'Vitamin B12', dosage: '1000mcg', timing: 'morning' as const },
    { name: 'Probiotics', dosage: '1 capsule', timing: 'morning' as const }
  ];
  
  return supplementTemplates.map((template, index) => ({
    id: `supplement-${index}`,
    title: template.name,
    description: `Sample supplement: ${template.name}`,
    type: 'supplement' as const,
    category: 'vitamins',
    priority: 'medium' as const,
    isActive: true,
    isCompleted: Math.random() > 0.3, // 70% completion rate
    isSkipped: false,
    isOverridden: false,
    defaultActive: true,
    streakCount: Math.floor(Math.random() * 14),
    dosage: template.dosage,
    timing: template.timing,
    frequency: 'daily' as const
  }));
}

/**
 * Populate localStorage with sample data for testing
 * @param days - Number of days of sample data to generate
 */
export function populateLocalStorageWithSampleData(days: number = 7) {
  try {
    // Generate and save daily entries
    const sampleEntries = generateSampleDailyEntries(days);
    localStorage.setItem('dailyEntries', JSON.stringify(sampleEntries));
    
    // Generate and save simple tasks
    const sampleTasks = generateSampleSimpleTasks();
    localStorage.setItem('simpleTasks', JSON.stringify(sampleTasks));
    
    // Generate and save supplements
    const sampleSupplements = generateSampleSupplements();
    localStorage.setItem('supplements', JSON.stringify(sampleSupplements));
    
    console.log(`Generated sample data for ${days} days:`, {
      entries: sampleEntries.length,
      tasks: sampleTasks.length,
      supplements: sampleSupplements.length
    });
    
    return {
      entries: sampleEntries,
      tasks: sampleTasks,
      supplements: sampleSupplements
    };
  } catch (error) {
    console.error('Error populating localStorage with sample data:', error);
    return null;
  }
}

/**
 * Clear all data from localStorage
 */
export function clearAllLocalStorageData() {
  try {
    localStorage.removeItem('dailyEntries');
    localStorage.removeItem('simpleTasks');
    localStorage.removeItem('supplements');
    console.log('Cleared all localStorage data');
  } catch (error) {
    console.error('Error clearing localStorage data:', error);
  }
}

/**
 * Check if localStorage has any data
 * @returns Object indicating what data exists
 */
export function checkLocalStorageData() {
  const hasEntries = !!localStorage.getItem('dailyEntries');
  const hasTasks = !!localStorage.getItem('simpleTasks');
  const hasSupplements = !!localStorage.getItem('supplements');
  
  let entryCount = 0;
  let taskCount = 0;
  let supplementCount = 0;
  
  try {
    if (hasEntries) {
      const entries = JSON.parse(localStorage.getItem('dailyEntries') || '[]');
      entryCount = entries.length;
    }
    if (hasTasks) {
      const tasks = JSON.parse(localStorage.getItem('simpleTasks') || '[]');
      taskCount = tasks.length;
    }
    if (hasSupplements) {
      const supplements = JSON.parse(localStorage.getItem('supplements') || '[]');
      supplementCount = supplements.length;
    }
  } catch (error) {
    console.error('Error reading localStorage data:', error);
  }
  
  return {
    hasEntries,
    hasTasks,
    hasSupplements,
    entryCount,
    taskCount,
    supplementCount,
    hasAnyData: hasEntries || hasTasks || hasSupplements
  };
}
