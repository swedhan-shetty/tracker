import { DailyEntry, SimpleTask, SupplementTask, Goal, Habit } from '../types';

export interface ExportData {
  metadata: {
    exportDate: string;
    version: string;
    totalEntries: number;
    totalTasks: number;
    totalSupplements: number;
    dateRange: {
      startDate: string;
      endDate: string;
    };
  };
  dailyEntries: DailyEntry[];
  simpleTasks: SimpleTask[];
  supplements: SupplementTask[];
  habits: Habit[];
}

export interface FlattenedEntry {
  // Entry metadata
  entryId: string;
  date: string;
  
  // Daily metrics
  mood: number;
  energy: number;
  productivity: number;
  sleep: number;
  exercise: boolean;
  notes: string;
  
  // Task summaries
  totalGoals: number;
  completedGoals: number;
  goalCompletionRate: number;
  
  // Individual goals (flattened)
  goalsList: string;
  completedGoalsList: string;
  
  // Habits
  totalHabits: number;
  completedHabits: number;
}

/**
 * Compile all data from localStorage into a structured export format
 * @returns Compiled export data object
 */
export function compileAllData(): ExportData {
  try {
    // Fetch all data from localStorage
    const dailyEntriesData = localStorage.getItem('dailyEntries');
    const simpleTasksData = localStorage.getItem('simpleTasks');
    const supplementsData = localStorage.getItem('supplements');
    const habitsData = localStorage.getItem('habits');

    const dailyEntries: DailyEntry[] = dailyEntriesData ? JSON.parse(dailyEntriesData) : [];
    const simpleTasks: SimpleTask[] = simpleTasksData ? JSON.parse(simpleTasksData) : [];
    const supplements: SupplementTask[] = supplementsData ? JSON.parse(supplementsData) : [];
    const habits: Habit[] = habitsData ? JSON.parse(habitsData) : [];

    // Calculate date range
    let startDate = '';
    let endDate = '';
    
    if (dailyEntries.length > 0) {
      const sortedEntries = [...dailyEntries].sort((a, b) => a.date.localeCompare(b.date));
      startDate = sortedEntries[0].date;
      endDate = sortedEntries[sortedEntries.length - 1].date;
    }

    const exportData: ExportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        totalEntries: dailyEntries.length,
        totalTasks: simpleTasks.length,
        totalSupplements: supplements.length,
        dateRange: {
          startDate,
          endDate
        }
      },
      dailyEntries,
      simpleTasks,
      supplements,
      habits
    };

    return exportData;
  } catch (error) {
    console.error('Error compiling data for export:', error);
    throw new Error('Failed to compile export data');
  }
}

/**
 * Convert export data to JSON string with formatting
 * @param data - Export data object
 * @returns Formatted JSON string
 */
export function convertToJSON(data: ExportData): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error converting to JSON:', error);
    throw new Error('Failed to convert data to JSON');
  }
}

/**
 * Flatten daily entries for CSV export
 * @param dailyEntries - Array of daily entries
 * @returns Array of flattened entry objects
 */
export function flattenDailyEntries(dailyEntries: DailyEntry[]): FlattenedEntry[] {
  return dailyEntries.map(entry => {
    const completedGoals = entry.goals.filter(g => g.completed);
    const completedHabits = entry.habits.filter(h => h.completed);
    
    return {
      // Entry metadata
      entryId: entry.id,
      date: entry.date,
      
      // Daily metrics
      mood: entry.mood,
      energy: entry.energy,
      productivity: entry.productivity,
      sleep: entry.sleep,
      exercise: entry.exercise,
      notes: entry.notes || '',
      
      // Task summaries
      totalGoals: entry.goals.length,
      completedGoals: completedGoals.length,
      goalCompletionRate: entry.goals.length > 0 ? Math.round((completedGoals.length / entry.goals.length) * 100) : 0,
      
      // Individual goals (flattened as strings)
      goalsList: entry.goals.map(g => g.title).join('; '),
      completedGoalsList: completedGoals.map(g => g.title).join('; '),
      
      // Habits
      totalHabits: entry.habits.length,
      completedHabits: completedHabits.length
    };
  });
}

/**
 * Convert array of objects to CSV string
 * @param data - Array of objects to convert
 * @param headers - Optional custom headers
 * @returns CSV formatted string
 */
export function convertArrayToCSV<T extends Record<string, any>>(data: T[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  const csvHeaders = headers || Object.keys(data[0]);
  const headerRow = csvHeaders.map(header => escapeCSVValue(header)).join(',');
  
  const dataRows = data.map(row => 
    csvHeaders.map(header => {
      const value = row[header];
      return escapeCSVValue(value);
    }).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV values to handle special characters
 * @param value - Value to escape
 * @returns Escaped CSV value
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Generate comprehensive CSV export with multiple sheets as separate sections
 * @param data - Export data object
 * @returns CSV formatted string with multiple sections
 */
export function convertToCSV(data: ExportData): string {
  const sections: string[] = [];

  // Metadata section
  sections.push('=== EXPORT METADATA ===');
  sections.push('Export Date,' + escapeCSVValue(data.metadata.exportDate));
  sections.push('Version,' + escapeCSVValue(data.metadata.version));
  sections.push('Total Entries,' + data.metadata.totalEntries);
  sections.push('Total Tasks,' + data.metadata.totalTasks);
  sections.push('Total Supplements,' + data.metadata.totalSupplements);
  sections.push('Date Range Start,' + escapeCSVValue(data.metadata.dateRange.startDate));
  sections.push('Date Range End,' + escapeCSVValue(data.metadata.dateRange.endDate));
  sections.push(''); // Empty line

  // Daily entries section
  if (data.dailyEntries.length > 0) {
    sections.push('=== DAILY ENTRIES ===');
    const flattenedEntries = flattenDailyEntries(data.dailyEntries);
    sections.push(convertArrayToCSV(flattenedEntries));
    sections.push(''); // Empty line
  }

  // Simple tasks section
  if (data.simpleTasks.length > 0) {
    sections.push('=== SIMPLE TASKS ===');
    sections.push(convertArrayToCSV(data.simpleTasks));
    sections.push(''); // Empty line
  }

  // Supplements section
  if (data.supplements.length > 0) {
    sections.push('=== SUPPLEMENTS ===');
    sections.push(convertArrayToCSV(data.supplements));
    sections.push(''); // Empty line
  }

  // Habits section
  if (data.habits.length > 0) {
    sections.push('=== HABITS ===');
    sections.push(convertArrayToCSV(data.habits));
    sections.push(''); // Empty line
  }

  return sections.join('\n');
}

/**
 * Trigger file download in the browser
 * @param content - File content as string
 * @param filename - Name of the file to download
 * @param contentType - MIME type of the file
 */
export function downloadFile(content: string, filename: string, contentType: string): void {
  try {
    // Create blob with content
    const blob = new Blob([content], { type: contentType });
    
    // Create object URL
    const url = URL.createObjectURL(blob);
    
    // Create temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    
    // Append to body (required for Firefox)
    document.body.appendChild(downloadLink);
    
    // Trigger download
    downloadLink.click();
    
    // Cleanup
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error(`Failed to download ${filename}`);
  }
}

/**
 * Generate filename with timestamp
 * @param baseName - Base name for the file
 * @param extension - File extension
 * @returns Filename with timestamp
 */
export function generateTimestampedFilename(baseName: string, extension: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0];
  return `${baseName}_${timestamp}.${extension}`;
}

/**
 * Export all data as JSON file
 */
export async function exportAsJSON(): Promise<void> {
  try {
    const data = compileAllData();
    const jsonContent = convertToJSON(data);
    const filename = generateTimestampedFilename('daily_tracker_export', 'json');
    
    downloadFile(jsonContent, filename, 'application/json');
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw error;
  }
}

/**
 * Export all data as CSV file
 */
export async function exportAsCSV(): Promise<void> {
  try {
    const data = compileAllData();
    const csvContent = convertToCSV(data);
    const filename = generateTimestampedFilename('daily_tracker_export', 'csv');
    
    downloadFile(csvContent, filename, 'text/csv');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}

/**
 * Export both JSON and CSV files
 */
export async function exportBothFormats(): Promise<void> {
  try {
    await exportAsJSON();
    // Small delay to avoid browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 100));
    await exportAsCSV();
  } catch (error) {
    console.error('Error exporting both formats:', error);
    throw error;
  }
}

/**
 * Get export data summary for display
 * @returns Summary of data available for export
 */
export function getExportSummary(): {
  hasData: boolean;
  entriesCount: number;
  tasksCount: number;
  supplementsCount: number;
  habitsCount: number;
  dateRange: string;
} {
  try {
    const data = compileAllData();
    
    let dateRange = 'No data';
    if (data.metadata.dateRange.startDate && data.metadata.dateRange.endDate) {
      if (data.metadata.dateRange.startDate === data.metadata.dateRange.endDate) {
        dateRange = data.metadata.dateRange.startDate;
      } else {
        dateRange = `${data.metadata.dateRange.startDate} to ${data.metadata.dateRange.endDate}`;
      }
    }
    
    return {
      hasData: data.metadata.totalEntries > 0 || data.metadata.totalTasks > 0 || data.metadata.totalSupplements > 0,
      entriesCount: data.metadata.totalEntries,
      tasksCount: data.metadata.totalTasks,
      supplementsCount: data.metadata.totalSupplements,
      habitsCount: data.habits.length,
      dateRange
    };
  } catch (error) {
    console.error('Error getting export summary:', error);
    return {
      hasData: false,
      entriesCount: 0,
      tasksCount: 0,
      supplementsCount: 0,
      habitsCount: 0,
      dateRange: 'Error'
    };
  }
}
