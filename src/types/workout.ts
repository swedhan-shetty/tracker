export interface Exercise {
  id: string;
  name: string;
  defaultSets: number;
  repRange: string;
  rest: string;
  notes: string;
  superset: string | null;
  dropSet: boolean;
  targetMuscles?: string[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  color: string;
  icon: string;
  exercises: Exercise[];
  estimatedDuration?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment?: string[];
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  completed: boolean;
  notes?: string;
  timestamp?: string;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  sets: ExerciseSet[];
  notes?: string;
  completed: boolean;
  totalVolume?: number; // total weight lifted
  totalSets?: number;
  totalReps?: number;
}

export interface WeeklyPlan {
  id: string;
  startDate: string;
  endDate: string;
  schedule: {
    [key: string]: {
      workoutId: string | null;
      isRestDay: boolean;
    };
  };
}

export interface ProgressStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  currentStreak: number;
  bestStreak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  personalRecord: {
    weight: number;
    reps: number;
    date: string;
  };
  recentProgress: {
    date: string;
    weight: number;
    reps: number;
    volume: number;
  }[];
  averageWeight: number;
  averageReps: number;
  progressTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface WorkoutFormData {
  templateId: string;
  date: string;
  notes?: string;
}

export type WorkoutView = 'calendar' | 'active' | 'progress' | 'history' | 'templates';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface CalendarDay {
  date: string;
  dayName: string;
  dayOfWeek: DayOfWeek;
  workout: WorkoutTemplate | null;
  session: WorkoutSession | null;
  isToday: boolean;
  isRestDay: boolean;
  status: 'planned' | 'completed' | 'missed' | 'rest';
}