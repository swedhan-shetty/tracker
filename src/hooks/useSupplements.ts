import { useState, useEffect, useCallback } from 'react';
import { SupplementTask, DailyEntry, TaskEvaluationResult } from '../types';
import {
  loadAndProcessSupplementsForToday,
  saveSupplements,
  processSupplementsForEntry,
  overrideSupplementStatus,
  resetSupplementOverride,
  toggleSupplementCompletion,
  getSupplementStatusSummary,
  createDefaultSupplement
} from '../utils/supplementUtils';
import { formatDate } from '../utils/dateUtils';

/**
 * Custom hook for managing supplements with conditional trigger logic
 */
export function useSupplements() {
  const [supplements, setSupplements] = useState<SupplementTask[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<TaskEvaluationResult[]>([]);
  const [currentEntry, setCurrentEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load supplements and process them for the current date
   */
  const loadSupplements = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loadAndProcessSupplementsForToday(date);
      setSupplements(result.supplements);
      setEvaluationResults(result.evaluationResults);
      setCurrentEntry(result.entry);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load supplements';
      setError(errorMessage);
      console.error('Error loading supplements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initialize supplements on mount
   */
  useEffect(() => {
    loadSupplements();
  }, [loadSupplements]);

  /**
   * Add a new supplement
   */
  const addSupplement = useCallback((supplementData: Partial<SupplementTask>) => {
    const newSupplement = createDefaultSupplement(
      supplementData.title || 'New Supplement',
      supplementData.category || 'general'
    );
    
    // Merge with provided data
    Object.assign(newSupplement, supplementData);
    
    const updatedSupplements = [...supplements, newSupplement];
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
    
    // Re-evaluate conditions
    if (currentEntry) {
      const processed = processSupplementsForEntry(updatedSupplements, currentEntry);
      setSupplements(processed);
    }
  }, [supplements, currentEntry]);

  /**
   * Update an existing supplement
   */
  const updateSupplement = useCallback((supplementId: string, updates: Partial<SupplementTask>) => {
    const updatedSupplements = supplements.map(supplement =>
      supplement.id === supplementId ? { ...supplement, ...updates } : supplement
    );
    
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
    
    // Re-evaluate conditions if rules changed
    if (updates.conditionRules && currentEntry) {
      const processed = processSupplementsForEntry(updatedSupplements, currentEntry);
      setSupplements(processed);
    }
  }, [supplements, currentEntry]);

  /**
   * Delete a supplement
   */
  const deleteSupplement = useCallback((supplementId: string) => {
    const updatedSupplements = supplements.filter(s => s.id !== supplementId);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  }, [supplements]);

  /**
   * Override a supplement's conditional status
   */
  const overrideSupplement = useCallback((supplementId: string, forceActive: boolean) => {
    const updatedSupplements = overrideSupplementStatus(supplements, supplementId, forceActive);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  }, [supplements]);

  /**
   * Reset override for a supplement
   */
  const resetOverride = useCallback((supplementId: string) => {
    if (!currentEntry) return;
    
    const updatedSupplements = resetSupplementOverride(supplements, supplementId, currentEntry);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  }, [supplements, currentEntry]);

  /**
   * Toggle supplement completion status
   */
  const toggleCompletion = useCallback((supplementId: string) => {
    const updatedSupplements = toggleSupplementCompletion(supplements, supplementId);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  }, [supplements]);

  /**
   * Re-evaluate all supplements when daily entry changes
   */
  const reevaluateForEntry = useCallback((entry: DailyEntry) => {
    const processedSupplements = processSupplementsForEntry(supplements, entry);
    setSupplements(processedSupplements);
    setCurrentEntry(entry);
    
    // Update evaluation results
    // Note: This would need the evaluation function to be called again
    // For simplicity, we'll reload everything
    loadSupplements(entry.date);
  }, [supplements, loadSupplements]);

  /**
   * Get supplements by status
   */
  const getSupplementsByStatus = useCallback((status: 'active' | 'skipped' | 'completed' | 'overridden') => {
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
  }, [supplements]);

  /**
   * Get status summary
   */
  const statusSummary = getSupplementStatusSummary(supplements);

  /**
   * Get supplements that are skipped but can be overridden
   */
  const skippedWithOverride = supplements.filter(s => 
    s.isSkipped && !s.isOverridden && s.conditionRules && s.conditionRules.length > 0
  );

  return {
    // State
    supplements,
    evaluationResults,
    currentEntry,
    loading,
    error,
    statusSummary,
    skippedWithOverride,

    // Actions
    loadSupplements,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    overrideSupplement,
    resetOverride,
    toggleCompletion,
    reevaluateForEntry,
    getSupplementsByStatus
  };
}

/**
 * Hook to automatically sync supplements when daily entries change
 * This would be used in components that manage daily entries
 */
export function useSupplementSync() {
  const [lastSyncDate, setLastSyncDate] = useState<string>('');

  const syncSupplementsForDate = useCallback(async (date: string, entry?: DailyEntry) => {
    if (lastSyncDate === date) return; // Already synced for this date
    
    try {
      const savedSupplements = localStorage.getItem('supplements');
      if (!savedSupplements) return;
      
      const supplements: SupplementTask[] = JSON.parse(savedSupplements);
      
      if (entry) {
        // If we have the entry, process supplements directly
        const processedSupplements = processSupplementsForEntry(supplements, entry);
        saveSupplements(processedSupplements);
      } else {
        // Otherwise, reload everything for the date
        await loadAndProcessSupplementsForToday(date);
      }
      
      setLastSyncDate(date);
    } catch (error) {
      console.error('Error syncing supplements for date:', date, error);
    }
  }, [lastSyncDate]);

  const syncSupplementsForToday = useCallback(() => {
    const today = formatDate(new Date());
    return syncSupplementsForDate(today);
  }, [syncSupplementsForDate]);

  return {
    syncSupplementsForDate,
    syncSupplementsForToday,
    lastSyncDate
  };
}
