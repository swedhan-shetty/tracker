import { DailyEntry } from '../types';
import { getDailyEntriesForPastDays } from './analyticsUtils';

export interface SummaryRequest {
  entries: DailySummaryData[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalDays: number;
  requestTimestamp: string;
}

export interface DailySummaryData {
  date: string;
  mood: number;
  energy: number;
  productivity: number;
  sleep: number;
  exercise: boolean;
  notes: string;
  goals: {
    total: number;
    completed: number;
    completionRate: number;
    completedGoals: string[];
  };
  habits: {
    total: number;
    completed: number;
  };
}

export interface SummaryResponse {
  summary: string;
  insights: string[];
  recommendations: string[];
  generatedAt: string;
  confidence: number;
}

export interface SavedSummary extends SummaryResponse {
  id: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  savedAt: string;
}

/**
 * Backend API configuration
 */
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  endpoints: {
    generateSummary: '/ai/generate-summary'
  },
  timeout: 30000 // 30 seconds for AI generation
};

/**
 * Prepare daily entries data for OpenAI summary generation
 * @param entries - Array of daily entries
 * @returns Formatted data suitable for AI analysis
 */
export function prepareSummaryData(entries: DailyEntry[]): DailySummaryData[] {
  return entries.map(entry => {
    const completedGoals = entry.goals.filter(g => g.completed);
    const completedHabits = entry.habits.filter(h => h.completed);
    
    return {
      date: entry.date,
      mood: entry.mood,
      energy: entry.energy,
      productivity: entry.productivity,
      sleep: entry.sleep,
      exercise: entry.exercise,
      notes: entry.notes || '',
      goals: {
        total: entry.goals.length,
        completed: completedGoals.length,
        completionRate: entry.goals.length > 0 ? Math.round((completedGoals.length / entry.goals.length) * 100) : 0,
        completedGoals: completedGoals.map(g => g.title)
      },
      habits: {
        total: entry.habits.length,
        completed: completedHabits.length
      }
    };
  });
}

/**
 * Generate summary request payload
 * @param days - Number of days to include (default: 7)
 * @returns Summary request payload
 */
export function createSummaryRequest(days: number = 7): SummaryRequest {
  const entries = getDailyEntriesForPastDays(days);
  const summaryData = prepareSummaryData(entries);
  
  let startDate = '';
  let endDate = '';
  
  if (entries.length > 0) {
    const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    startDate = sortedEntries[0].date;
    endDate = sortedEntries[sortedEntries.length - 1].date;
  }
  
  return {
    entries: summaryData,
    dateRange: {
      startDate,
      endDate
    },
    totalDays: entries.length,
    requestTimestamp: new Date().toISOString()
  };
}

/**
 * Call backend API to generate summary using OpenAI
 * @param summaryRequest - Prepared summary request
 * @returns Promise resolving to AI-generated summary
 */
export async function generateAISummary(summaryRequest: SummaryRequest): Promise<SummaryResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.generateSummary}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || ''}`,
      },
      body: JSON.stringify(summaryRequest),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    const summaryResponse: SummaryResponse = await response.json();
    
    // Validate response structure
    if (!summaryResponse.summary || typeof summaryResponse.summary !== 'string') {
      throw new Error('Invalid response format: missing summary');
    }
    
    return summaryResponse;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('Unknown error occurred during summary generation');
  }
}

/**
 * Mock AI summary generation for development/demo purposes
 * @param summaryRequest - Summary request data
 * @returns Promise resolving to mock summary
 */
export async function generateMockSummary(summaryRequest: SummaryRequest): Promise<SummaryResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { entries, dateRange, totalDays } = summaryRequest;
  
  // Calculate basic statistics for realistic mock
  const avgMood = entries.length > 0 ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length : 0;
  const avgEnergy = entries.length > 0 ? entries.reduce((sum, e) => sum + e.energy, 0) / entries.length : 0;
  const avgProductivity = entries.length > 0 ? entries.reduce((sum, e) => sum + e.productivity, 0) / entries.length : 0;
  const avgSleep = entries.length > 0 ? entries.reduce((sum, e) => sum + e.sleep, 0) / entries.length : 0;
  const exerciseDays = entries.filter(e => e.exercise).length;
  const totalGoalsCompleted = entries.reduce((sum, e) => sum + e.goals.completed, 0);
  const hasNotes = entries.some(e => e.notes && e.notes.length > 0);
  
  // Generate contextual summary based on actual data
  let summary = `Over the past ${totalDays} days (${dateRange.startDate} to ${dateRange.endDate}), your wellness journey shows `;
  
  if (avgMood >= 7) {
    summary += "strong emotional wellbeing with consistently positive mood ratings. ";
  } else if (avgMood >= 5) {
    summary += "moderate emotional balance with some fluctuations in mood. ";
  } else {
    summary += "challenges in emotional wellbeing that may benefit from additional support. ";
  }
  
  if (avgEnergy >= 7) {
    summary += "You've maintained high energy levels throughout the week, ";
  } else if (avgEnergy >= 5) {
    summary += "Your energy levels have been moderate with room for improvement, ";
  } else {
    summary += "You've experienced lower energy levels that may indicate need for rest or lifestyle adjustments, ";
  }
  
  summary += `complemented by ${avgProductivity >= 6 ? 'strong' : 'developing'} productivity patterns. `;
  
  summary += `Your sleep average of ${avgSleep.toFixed(1)} hours ${avgSleep >= 7 ? 'meets' : 'falls below'} recommended guidelines. `;
  
  if (exerciseDays > totalDays * 0.7) {
    summary += "Your exercise consistency has been excellent, contributing positively to your overall wellness. ";
  } else if (exerciseDays > totalDays * 0.4) {
    summary += "You've maintained moderate exercise habits with opportunities to increase consistency. ";
  } else {
    summary += "Increasing physical activity could significantly boost your energy and mood levels. ";
  }
  
  if (totalGoalsCompleted > 0) {
    summary += `You've successfully completed ${totalGoalsCompleted} goals, demonstrating commitment to personal growth. `;
  }
  
  if (hasNotes) {
    summary += "Your reflective notes indicate thoughtful self-awareness and engagement with the tracking process.";
  }
  
  // Generate insights based on patterns
  const insights: string[] = [];
  
  if (avgMood > avgEnergy + 1) {
    insights.push("Your mood tends to be higher than your energy levels, suggesting good emotional resilience despite physical fatigue.");
  }
  
  if (exerciseDays > 0 && avgMood >= 6) {
    insights.push("Days with exercise correlate with better mood scores, highlighting the mental health benefits of physical activity.");
  }
  
  if (avgSleep < 7 && avgEnergy < 6) {
    insights.push("Lower sleep duration appears linked to reduced energy levels, indicating the importance of sleep for daily vitality.");
  }
  
  if (totalGoalsCompleted > totalDays) {
    insights.push("Your goal completion rate exceeds one per day, showing strong motivation and achievement-oriented behavior.");
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (avgSleep < 7) {
    recommendations.push("Consider establishing a consistent sleep schedule to aim for 7-9 hours nightly for optimal recovery.");
  }
  
  if (exerciseDays < totalDays * 0.5) {
    recommendations.push("Incorporate more regular physical activity, even light walks, to boost energy and mood levels.");
  }
  
  if (avgMood < 6) {
    recommendations.push("Consider mindfulness practices, social connections, or professional support to enhance emotional wellbeing.");
  }
  
  if (avgProductivity < avgEnergy - 1) {
    recommendations.push("Explore time management techniques or workspace optimization to better convert energy into productive output.");
  }
  
  if (!hasNotes) {
    recommendations.push("Adding brief daily reflections could provide valuable insights into patterns and triggers.");
  }
  
  return {
    summary,
    insights: insights.length > 0 ? insights : ["Continue tracking consistently to identify meaningful patterns in your wellness data."],
    recommendations: recommendations.length > 0 ? recommendations : ["Maintain your current positive habits while staying mindful of areas for growth."],
    generatedAt: new Date().toISOString(),
    confidence: 0.85
  };
}

/**
 * Generate weekly summary with error handling
 * @param days - Number of days to include
 * @param useMock - Whether to use mock API (for development)
 * @returns Promise resolving to summary response
 */
export async function generateWeeklySummary(days: number = 7, useMock: boolean = true): Promise<SummaryResponse> {
  const summaryRequest = createSummaryRequest(days);
  
  if (summaryRequest.totalDays === 0) {
    throw new Error('No data available for the requested time period. Please add some daily entries first.');
  }
  
  try {
    if (useMock || !API_CONFIG.baseURL.includes('http')) {
      return await generateMockSummary(summaryRequest);
    } else {
      return await generateAISummary(summaryRequest);
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

/**
 * Save summary to localStorage
 * @param summary - Summary response to save
 * @param dateRange - Date range for the summary
 * @returns Saved summary with ID
 */
export function saveSummaryToStorage(summary: SummaryResponse, dateRange: { startDate: string; endDate: string }): SavedSummary {
  const savedSummary: SavedSummary = {
    ...summary,
    id: `summary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    dateRange,
    savedAt: new Date().toISOString()
  };
  
  try {
    const existingSummaries = getSavedSummaries();
    const updatedSummaries = [...existingSummaries, savedSummary];
    localStorage.setItem('savedSummaries', JSON.stringify(updatedSummaries));
    return savedSummary;
  } catch (error) {
    console.error('Error saving summary to localStorage:', error);
    throw new Error('Failed to save summary');
  }
}

/**
 * Retrieve saved summaries from localStorage
 * @returns Array of saved summaries
 */
export function getSavedSummaries(): SavedSummary[] {
  try {
    const saved = localStorage.getItem('savedSummaries');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading saved summaries:', error);
    return [];
  }
}

/**
 * Delete a saved summary
 * @param summaryId - ID of summary to delete
 */
export function deleteSavedSummary(summaryId: string): void {
  try {
    const summaries = getSavedSummaries();
    const filtered = summaries.filter(s => s.id !== summaryId);
    localStorage.setItem('savedSummaries', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting summary:', error);
    throw new Error('Failed to delete summary');
  }
}

/**
 * Get summary statistics for display
 * @returns Statistics about saved summaries
 */
export function getSummaryStats(): {
  totalSaved: number;
  lastGenerated: string | null;
  dateRange: string | null;
} {
  try {
    const summaries = getSavedSummaries();
    
    if (summaries.length === 0) {
      return {
        totalSaved: 0,
        lastGenerated: null,
        dateRange: null
      };
    }
    
    const latest = summaries.sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0];
    
    return {
      totalSaved: summaries.length,
      lastGenerated: latest.savedAt,
      dateRange: `${latest.dateRange.startDate} to ${latest.dateRange.endDate}`
    };
  } catch (error) {
    console.error('Error getting summary stats:', error);
    return {
      totalSaved: 0,
      lastGenerated: null,
      dateRange: null
    };
  }
}
