import { useState, useEffect } from 'react';
import { SimpleTask } from '../types';
import { updateTaskStreaks, toggleTaskAndUpdateStreak } from '../utils/streakUtils';

/**
 * Custom hook for managing simple tasks with streak counting
 */
export function useSimpleTasks() {
  const [tasks, setTasks] = useState<SimpleTask[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('simpleTasks');
    if (savedTasks) {
      const parsedTasks: SimpleTask[] = JSON.parse(savedTasks);
      // Update streak counts on load
      const tasksWithStreaks = updateTaskStreaks(parsedTasks);
      setTasks(tasksWithStreaks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('simpleTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  /**
   * Add a new simple task
   */
  const addTask = (taskData: Omit<SimpleTask, 'id' | 'streakCount'>) => {
    const newTask: SimpleTask = {
      ...taskData,
      id: Date.now().toString(),
      streakCount: 0
    };
    
    setTasks(prev => [...prev, newTask]);
  };

  /**
   * Update an existing task
   */
  const updateTask = (taskId: string, updates: Partial<SimpleTask>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  /**
   * Delete a task
   */
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  /**
   * Toggle task completion status and update streak
   */
  const toggleTask = (taskId: string, completed?: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedStatus = completed !== undefined ? completed : !task.completed;
    
    // Update the task completion in daily entries and get new streak count
    const newStreakCount = toggleTaskAndUpdateStreak(taskId, newCompletedStatus);
    
    // Update the task in state
    setTasks(prev => 
      prev.map(t => 
        t.id === taskId 
          ? { ...t, completed: newCompletedStatus, streakCount: newStreakCount }
          : t
      )
    );
  };

  /**
   * Refresh streak counts for all tasks
   */
  const refreshStreaks = () => {
    const updatedTasks = updateTaskStreaks(tasks);
    setTasks(updatedTasks);
  };

  /**
   * Get a task by ID
   */
  const getTask = (taskId: string): SimpleTask | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  /**
   * Get tasks filtered by completion status
   */
  const getTasksByStatus = (completed: boolean): SimpleTask[] => {
    return tasks.filter(task => task.completed === completed);
  };

  /**
   * Get tasks sorted by streak count (descending)
   */
  const getTasksByStreak = (): SimpleTask[] => {
    return [...tasks].sort((a, b) => b.streakCount - a.streakCount);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refreshStreaks,
    getTask,
    getTasksByStatus,
    getTasksByStreak
  };
}
