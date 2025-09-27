import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { 
  WorkoutTemplate, 
  WorkoutSession, 
  ExerciseSet, 
  WeeklyPlan, 
  ProgressStats,
  CalendarDay,
  DayOfWeek
} from '../types/workout';
import { v4 as uuidv4 } from 'uuid';

// Default workout templates based on the reference data
const defaultWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: 'legs',
    name: 'Legs',
    color: '#ef4444',
    icon: '🦵',
    estimatedDuration: 75,
    difficulty: 'Intermediate',
    exercises: [
      {
        id: 'leg_press',
        name: 'Leg Press',
        defaultSets: 4,
        repRange: '8-12',
        rest: '3min',
        notes: 'Feet low on platform, slow negative, track total weight including machine',
        superset: null,
        dropSet: false,
      },
      {
        id: 'leg_extensions',
        name: 'Leg Extensions',
        defaultSets: 4,
        repRange: '8-12',
        rest: '2.5min',
        notes: '3-sec hold at top, last set DROP SET',
        superset: null,
        dropSet: true,
      },
      {
        id: 'seated_leg_curls',
        name: 'Seated Leg Curls',
        defaultSets: 4,
        repRange: '8-12',
        rest: '2.5min',
        notes: 'Control negative, squeeze at top',
        superset: null,
        dropSet: false,
      },
      {
        id: 'hip_thrusts',
        name: 'Hip Thrusts',
        defaultSets: 3,
        repRange: '10-15',
        rest: '2min',
        notes: 'Week 1-2: Bodyweight only, then progress with plates',
        superset: null,
        dropSet: false,
      },
      {
        id: 'calf_raises',
        name: 'Calf Raises (Standing)',
        defaultSets: 3,
        repRange: '12-15',
        rest: '90sec',
        notes: 'Full ROM, 2-sec pause at top',
        superset: null,
        dropSet: false,
      },
    ],
  },
  {
    id: 'pull',
    name: 'Pull (Back & Biceps)',
    color: '#3b82f6',
    icon: '💪',
    estimatedDuration: 70,
    difficulty: 'Intermediate',
    exercises: [
      {
        id: 'lat_pulldown',
        name: 'Lat Pulldown',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: 'Wide grip, focus on lats',
        superset: 'A',
        dropSet: false,
      },
      {
        id: 'machine_preacher_curls',
        name: 'Machine Preacher Curls',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: 'Control tempo, last set DROP SET',
        superset: 'A',
        dropSet: true,
      },
      {
        id: 'tbar_row',
        name: 'T-Bar Row',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: 'Chest supported, squeeze shoulder blades',
        superset: 'B',
        dropSet: false,
      },
      {
        id: 'hammer_curls',
        name: 'Hammer Curls',
        defaultSets: 3,
        repRange: '10-15',
        rest: '90sec',
        notes: 'Control negative, no swing',
        superset: 'B',
        dropSet: false,
      },
      {
        id: 'seated_cable_row',
        name: 'Seated Cable Row',
        defaultSets: 3,
        repRange: '8-12',
        rest: '2min',
        notes: 'Wide grip, retract shoulder blades',
        superset: null,
        dropSet: false,
      },
      {
        id: 'back_extensions',
        name: 'Back Extensions',
        defaultSets: 3,
        repRange: '12-15',
        rest: '90sec',
        notes: 'Control movement, don\'t hyperextend',
        superset: null,
        dropSet: false,
      },
      {
        id: 'shrugs',
        name: 'Shrugs',
        defaultSets: 3,
        repRange: '10-12',
        rest: '90sec',
        notes: 'Hold 2-sec at top',
        superset: null,
        dropSet: false,
      },
      {
        id: 'reverse_pec_deck',
        name: 'Reverse Pec Deck',
        defaultSets: 3,
        repRange: '12-15',
        rest: '90sec',
        notes: 'Rear delt focus, last set DROP SET',
        superset: null,
        dropSet: true,
      },
    ],
  },
  {
    id: 'push',
    name: 'Push (Chest, Shoulders & Triceps)',
    color: '#10b981',
    icon: '🤲',
    estimatedDuration: 70,
    difficulty: 'Intermediate',
    exercises: [
      {
        id: 'incline_db_press',
        name: 'Incline Dumbbell Press',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: '45-degree incline, control negative',
        superset: 'A',
        dropSet: false,
      },
      {
        id: 'tricep_pushdowns',
        name: 'Tricep Pushdowns',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: 'Various grips, last set DROP SET',
        superset: 'A',
        dropSet: true,
      },
      {
        id: 'db_shoulder_press',
        name: 'Dumbbell Shoulder Press',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: 'Seated or standing, press up and slightly back',
        superset: 'B',
        dropSet: false,
      },
      {
        id: 'lateral_raises',
        name: 'Lateral Raises',
        defaultSets: 3,
        repRange: '10-15',
        rest: '90sec',
        notes: 'Control tempo, slight forward lean',
        superset: 'B',
        dropSet: false,
      },
      {
        id: 'flat_db_press',
        name: 'Flat Dumbbell Press',
        defaultSets: 3,
        repRange: '8-12',
        rest: '2.5min',
        notes: 'Control negative, full ROM',
        superset: null,
        dropSet: false,
      },
      {
        id: 'machine_flyes',
        name: 'Machine Flyes',
        defaultSets: 3,
        repRange: '10-15',
        rest: '90sec',
        notes: 'Control movement, stretch at bottom',
        superset: null,
        dropSet: false,
      },
      {
        id: 'overhead_tricep_extension',
        name: 'Overhead Tricep Extension',
        defaultSets: 3,
        repRange: '8-12',
        rest: '90sec',
        notes: 'Keep elbows stationary',
        superset: null,
        dropSet: false,
      },
    ],
  },
];

const defaultWeeklyPlan: WeeklyPlan = {
  id: 'default-plan',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  schedule: {
    monday: { workoutId: 'legs', isRestDay: false },
    tuesday: { workoutId: null, isRestDay: true },
    wednesday: { workoutId: 'pull', isRestDay: false },
    thursday: { workoutId: 'push', isRestDay: false },
    friday: { workoutId: 'legs', isRestDay: false },
    saturday: { workoutId: 'pull', isRestDay: false },
    sunday: { workoutId: 'push', isRestDay: false },
  },
};

export function useWorkoutTracker() {
  const [workoutTemplates] = useLocalStorage<WorkoutTemplate[]>('workoutTemplates', defaultWorkoutTemplates);
  const [workoutSessions, setWorkoutSessions] = useLocalStorage<WorkoutSession[]>('workoutSessions', []);
  const [weeklyPlan, setWeeklyPlan] = useLocalStorage<WeeklyPlan>('weeklyPlan', defaultWeeklyPlan);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get current week's dates
  const getCurrentWeekDates = useCallback((referenceDate: Date = new Date()): Date[] => {
    const startOfWeek = new Date(referenceDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  }, []);

  // Get calendar days for current week
  const calendarDays = useMemo((): CalendarDay[] => {
    const weekDates = getCurrentWeekDates(currentWeek);
    const today = new Date();
    const dayNames: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return weekDates.map((date, index) => {
      const dayOfWeek = dayNames[index];
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      
      const scheduleDay = weeklyPlan.schedule[dayOfWeek];
      const workout = scheduleDay?.workoutId ? workoutTemplates.find(w => w.id === scheduleDay.workoutId) || null : null;
      const session = workoutSessions.find(s => s.date === dateString) || null;
      
      let status: CalendarDay['status'];
      if (scheduleDay?.isRestDay) {
        status = 'rest';
      } else if (session?.completed) {
        status = 'completed';
      } else if (date < today && !session) {
        status = 'missed';
      } else {
        status = 'planned';
      }
      
      return {
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayOfWeek,
        workout,
        session,
        isToday,
        isRestDay: scheduleDay?.isRestDay || false,
        status,
      };
    });
  }, [currentWeek, weeklyPlan, workoutTemplates, workoutSessions, getCurrentWeekDates]);

  // Progress statistics
  const progressStats = useMemo((): ProgressStats => {
    const completedSessions = workoutSessions.filter(s => s.completed);
    const totalVolume = completedSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    // Calculate current streak
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (checkDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      const dateString = checkDate.toISOString().split('T')[0];
      const session = workoutSessions.find(s => s.date === dateString && s.completed);
      
      if (session) {
        currentStreak++;
      } else {
        // Check if it was a planned rest day
        const dayOfWeek = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
        const isRestDay = weeklyPlan.schedule[dayOfWeek]?.isRestDay;
        if (!isRestDay) break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Calculate weekly progress
    const thisWeekDates = getCurrentWeekDates();
    const thisWeekSessions = workoutSessions.filter(s => 
      thisWeekDates.some(date => date.toISOString().split('T')[0] === s.date) && s.completed
    );
    
    const plannedWorkoutsThisWeek = Object.values(weeklyPlan.schedule).filter(day => !day.isRestDay).length;
    
    return {
      totalWorkouts: completedSessions.length,
      totalVolume,
      averageDuration: completedSessions.length > 0 ? totalDuration / completedSessions.length : 0,
      currentStreak,
      bestStreak: currentStreak, // Simplified for now
      weeklyGoal: plannedWorkoutsThisWeek,
      weeklyCompleted: thisWeekSessions.length,
    };
  }, [workoutSessions, weeklyPlan, getCurrentWeekDates]);

  // Start a new workout session
  const startWorkout = useCallback((templateId: string, date?: string) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return null;
    
    const sessionDate = date || new Date().toISOString().split('T')[0];
    const newSession: WorkoutSession = {
      id: uuidv4(),
      templateId: template.id,
      templateName: template.name,
      date: sessionDate,
      startTime: new Date().toISOString(),
      sets: [],
      completed: false,
      notes: '',
    };
    
    setCurrentSession(newSession);
    return newSession;
  }, [workoutTemplates]);

  // Add a set to the current session
  const addSet = useCallback((exerciseId: string, reps: number, weight: number, notes?: string) => {
    if (!currentSession) return;
    
    const existingSets = currentSession.sets.filter(s => s.exerciseId === exerciseId);
    const setNumber = existingSets.length + 1;
    
    const newSet: ExerciseSet = {
      id: uuidv4(),
      exerciseId,
      setNumber,
      reps,
      weight,
      completed: true,
      notes,
      timestamp: new Date().toISOString(),
    };
    
    const updatedSession = {
      ...currentSession,
      sets: [...currentSession.sets, newSet],
    };
    
    setCurrentSession(updatedSession);
  }, [currentSession]);

  // Complete the current workout session
  const completeWorkout = useCallback((notes?: string) => {
    if (!currentSession) return;
    
    const endTime = new Date().toISOString();
    const duration = Math.floor((new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60));
    const totalVolume = currentSession.sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
    
    const completedSession: WorkoutSession = {
      ...currentSession,
      endTime,
      duration,
      totalVolume,
      totalSets: currentSession.sets.length,
      totalReps: currentSession.sets.reduce((sum, set) => sum + set.reps, 0),
      completed: true,
      notes: notes || currentSession.notes || '',
    };
    
    setWorkoutSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === completedSession.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = completedSession;
        return updated;
      }
      return [...prev, completedSession];
    });
    
    setCurrentSession(null);
    return completedSession;
  }, [currentSession, setWorkoutSessions]);

  // Navigation functions
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeek(new Date());
  }, []);

  return {
    // Data
    workoutTemplates,
    workoutSessions,
    currentSession,
    calendarDays,
    progressStats,
    currentWeek,
    
    // Actions
    startWorkout,
    addSet,
    completeWorkout,
    setCurrentSession,
    
    // Navigation
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    
    // Utilities
    getCurrentWeekDates,
  };
}
