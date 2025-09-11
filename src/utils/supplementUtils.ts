import { CoreTask, SupplementTask, DailyEntry, TaskEvaluationResult } from '../types';
import { evaluateMultipleTasks, updateTasksFromEvaluation } from './conditionEngine';
import { formatDate } from './dateUtils';

/**
 * Process supplements on daily entry load and mark tasks as active/inactive
 * @param supplements - Array of supplement tasks
 * @param entry - The daily entry to evaluate against
 * @returns Updated supplements with active/inactive status
 */
export function processSupplementsForEntry(supplements: SupplementTask[], entry: DailyEntry): SupplementTask[] {
  // Evaluate all supplements against the current entry
  const evaluationResults = evaluateMultipleTasks(supplements, entry);
  
  // Update supplements based on evaluation results
  const updatedSupplements = updateTasksFromEvaluation(supplements, evaluationResults) as SupplementTask[];
  
  return updatedSupplements;
}

/**
 * Override a supplement's conditional status (user manual override)
 * @param supplements - Array of supplement tasks
 * @param supplementId - ID of the supplement to override
 * @param forceActive - Whether to force the supplement as active
 * @returns Updated supplements array
 */
export function overrideSupplementStatus(
  supplements: SupplementTask[], 
  supplementId: string, 
  forceActive: boolean
): SupplementTask[] {
  return supplements.map(supplement => {
    if (supplement.id === supplementId) {
      return {
        ...supplement,
        isActive: forceActive,
        isSkipped: !forceActive,
        isOverridden: true
      };
    }
    return supplement;
  });
}

/**
 * Reset override status for a supplement
 * @param supplements - Array of supplement tasks
 * @param supplementId - ID of the supplement to reset
 * @param entry - Current daily entry for re-evaluation
 * @returns Updated supplements array
 */
export function resetSupplementOverride(
  supplements: SupplementTask[], 
  supplementId: string, 
  entry: DailyEntry
): SupplementTask[] {
  const supplement = supplements.find(s => s.id === supplementId);
  if (!supplement) return supplements;
  
  // Reset override and re-evaluate
  const resetSupplement = { ...supplement, isOverridden: false };
  const evaluationResult = evaluateMultipleTasks([resetSupplement], entry)[0];
  
  return supplements.map(s => {
    if (s.id === supplementId) {
      return {
        ...resetSupplement,
        isActive: evaluationResult.isActive,
        isSkipped: evaluationResult.isSkipped
      };
    }
    return s;
  });
}

/**
 * Get supplements filtered by their current status
 * @param supplements - Array of supplement tasks
 * @param status - Filter criteria
 * @returns Filtered supplements
 */
export function getSupplementsByStatus(
  supplements: SupplementTask[], 
  status: 'active' | 'skipped' | 'completed' | 'overridden'
): SupplementTask[] {
  switch (status) {
    case 'active':
      return supplements.filter(s => s.isActive && !s.isSkipped);
    case 'skipped':
      return supplements.filter(s => s.isSkipped && !s.isOverridden);
    case 'completed':
      return supplements.filter(s => s.isCompleted);
    case 'overridden':
      return supplements.filter(s => s.isOverridden);
    default:
      return supplements;
  }
}

/**
 * Create a summary of supplement status for UI display
 * @param supplements - Array of supplement tasks
 * @returns Status summary object
 */
export function getSupplementStatusSummary(supplements: SupplementTask[]) {
  const total = supplements.length;
  const active = supplements.filter(s => s.isActive).length;
  const skipped = supplements.filter(s => s.isSkipped).length;
  const completed = supplements.filter(s => s.isCompleted).length;
  const overridden = supplements.filter(s => s.isOverridden).length;
  
  return {
    total,
    active,
    skipped,
    completed,
    overridden,
    pending: active - completed
  };
}

/**
 * Toggle supplement completion status
 * @param supplements - Array of supplement tasks
 * @param supplementId - ID of supplement to toggle
 * @returns Updated supplements array
 */
export function toggleSupplementCompletion(supplements: SupplementTask[], supplementId: string): SupplementTask[] {
  return supplements.map(supplement => {
    if (supplement.id === supplementId) {
      return {
        ...supplement,
        isCompleted: !supplement.isCompleted
      };
    }
    return supplement;
  });
}

/**
 * Load and process supplements for today's entry
 * @param date - Date string (defaults to today)
 * @returns Promise resolving to processed supplements and evaluation results
 */
export async function loadAndProcessSupplementsForToday(
  date: string = formatDate(new Date())
): Promise<{
  supplements: SupplementTask[];
  evaluationResults: TaskEvaluationResult[];
  entry: DailyEntry | null;
}> {
  try {
    // Load supplements from localStorage
    const savedSupplements = localStorage.getItem('supplements');
    const supplements: SupplementTask[] = savedSupplements ? JSON.parse(savedSupplements) : [];
    
    // Load daily entries from localStorage
    const savedEntries = localStorage.getItem('dailyEntries');
    const entries: DailyEntry[] = savedEntries ? JSON.parse(savedEntries) : [];
    
    // Find today's entry
    const todayEntry = entries.find(entry => entry.date === date);
    
    if (!todayEntry) {
      // No entry for today, return supplements with default states
      return {
        supplements: supplements.map(s => ({
          ...s,
          isActive: s.defaultActive,
          isSkipped: !s.defaultActive && !!s.conditionRules?.length
        })),
        evaluationResults: [],
        entry: null
      };
    }
    
    // Process supplements against today's entry
    const evaluationResults = evaluateMultipleTasks(supplements, todayEntry);
    const processedSupplements = processSupplementsForEntry(supplements, todayEntry);
    
    return {
      supplements: processedSupplements,
      evaluationResults,
      entry: todayEntry
    };
    
  } catch (error) {
    console.error('Error loading and processing supplements:', error);
    return {
      supplements: [],
      evaluationResults: [],
      entry: null
    };
  }
}

/**
 * Save supplements to localStorage
 * @param supplements - Array of supplements to save
 */
export function saveSupplements(supplements: SupplementTask[]): void {
  try {
    localStorage.setItem('supplements', JSON.stringify(supplements));
  } catch (error) {
    console.error('Error saving supplements to localStorage:', error);
  }
}

/**
 * Create a default supplement task
 * @param name - Name of the supplement
 * @param category - Category (e.g., 'vitamins', 'minerals', 'herbs')
 * @returns New SupplementTask object
 */
export function createDefaultSupplement(name: string, category: string = 'general'): SupplementTask {
  return {
    id: `supplement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: name,
    description: '',
    type: 'supplement',
    category,
    priority: 'medium',
    isActive: true,
    isCompleted: false,
    isSkipped: false,
    isOverridden: false,
    defaultActive: true,
    streakCount: 0,
    dosage: '',
    timing: 'morning',
    frequency: 'daily'
  };
}

/**
 * Get supplements that should be shown as "skipped" with override options
 * @param supplements - Array of supplements
 * @returns Supplements that are skipped but can be overridden
 */
export function getSkippedSupplementsWithOverride(supplements: SupplementTask[]): SupplementTask[] {
  return supplements.filter(supplement => 
    supplement.isSkipped && 
    !supplement.isOverridden && 
    supplement.conditionRules && 
    supplement.conditionRules.length > 0
  );
}

/**
 * Get user-friendly timing display
 * @param timing - Timing enum value
 * @returns Human-readable timing string
 */
export function getTimingDisplay(timing: SupplementTask['timing']): string {
  switch (timing) {
    case 'morning': return 'Morning';
    case 'afternoon': return 'Afternoon';
    case 'evening': return 'Evening';
    case 'with_meal': return 'With meals';
    case 'before_bed': return 'Before bed';
    default: return 'Any time';
  }
}

/**
 * Group supplements by timing for organized display
 * @param supplements - Array of supplements
 * @returns Object with supplements grouped by timing
 */
export function groupSupplementsByTiming(supplements: SupplementTask[]): Record<string, SupplementTask[]> {
  const grouped: Record<string, SupplementTask[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    with_meal: [],
    before_bed: [],
    any_time: []
  };
  
  supplements.forEach(supplement => {
    const timing = supplement.timing || 'any_time';
    if (!grouped[timing]) {
      grouped.any_time.push(supplement);
    } else {
      grouped[timing].push(supplement);
    }
  });
  
  return grouped;
}
