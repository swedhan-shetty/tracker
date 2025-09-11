export interface DailyEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  productivity: number; // 1-10 scale
  sleep: number; // hours
  exercise: boolean;
  notes: string;
  goals: Goal[];
  habits: HabitCheck[];
  // Optional linkage to macro totals for the day (Phase 1 keeps macros in a separate store)
  macroSummaryId?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  target: number; // target per day/week
  color: string;
}

export interface HabitCheck {
  habitId: string;
  completed: boolean;
  value?: number; // for quantifiable habits
}

export interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  reminderTime?: string;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface SimpleTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  streakCount: number;
}

export interface ConditionRule {
  metric: 'mood' | 'energy' | 'productivity' | 'sleep' | 'exercise';
  comparator: '<' | '>' | '=' | '<=' | '>=' | '!=';
  value: number | boolean;
  logicOperator?: 'AND' | 'OR'; // For combining multiple rules
}

export interface CoreTask {
  id: string;
  title: string;
  description: string;
  type: 'supplement' | 'routine' | 'goal';
  category: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean; // Whether the task is currently active based on conditions
  isCompleted: boolean;
  isSkipped: boolean; // Whether the task was skipped due to conditions
  isOverridden: boolean; // Whether user manually overrode the condition
  conditionRules?: ConditionRule[]; // Optional conditional logic
  defaultActive: boolean; // Whether task is active by default (when no rules or all rules fail)
  streakCount: number;
}

export interface SupplementTask extends CoreTask {
  type: 'supplement';
  dosage?: string;
  timing?: 'morning' | 'afternoon' | 'evening' | 'with_meal' | 'before_bed';
  frequency?: 'daily' | 'weekly' | 'as_needed';
}

export interface TaskEvaluationResult {
  taskId: string;
  isActive: boolean;
  isSkipped: boolean;
  evaluatedRules: {
    rule: ConditionRule;
    result: boolean;
    reason: string;
  }[];
  finalReason: string;
}

export interface FilterOptions {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
}
