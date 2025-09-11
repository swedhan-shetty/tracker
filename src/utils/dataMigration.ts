import { DailyEntry, Habit } from '../types';
import { DatabaseService } from '../services/databaseService';

/**
 * Migrate existing localStorage data to cloud database
 * This runs once per user when they first sign in
 */
export async function migrateLocalStorageToCloud(): Promise<{
  entriesMigrated: number;
  habitsMigrated: number;
  success: boolean;
  error?: string;
}> {
  try {
    console.log('Starting data migration from localStorage to cloud...');
    
    // Check if user is authenticated
    const user = await DatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get existing cloud data to avoid duplicates
    const [cloudEntries, cloudHabits] = await Promise.all([
      DatabaseService.getDailyEntries(),
      DatabaseService.getHabits()
    ]);
    
    let entriesMigrated = 0;
    let habitsMigrated = 0;
    
    // Migrate daily entries
    const savedEntries = localStorage.getItem('dailyEntries');
    if (savedEntries) {
      const localEntries: DailyEntry[] = JSON.parse(savedEntries);
      
      for (const entry of localEntries) {
        // Check if entry already exists in cloud (by date)
        const existsInCloud = cloudEntries.some(cloudEntry => cloudEntry.date === entry.date);
        
        if (!existsInCloud) {
          try {
            await DatabaseService.saveDailyEntry({
              ...entry,
              id: `migrated_${entry.id}` // Ensure unique ID
            });
            entriesMigrated++;
            console.log(`Migrated entry for ${entry.date}`);
          } catch (error) {
            console.warn(`Failed to migrate entry for ${entry.date}:`, error);
          }
        }
      }
    }
    
    // Migrate habits
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const localHabits: Habit[] = JSON.parse(savedHabits);
      
      for (const habit of localHabits) {
        // Check if habit already exists in cloud (by name)
        const existsInCloud = cloudHabits.some(cloudHabit => cloudHabit.name === habit.name);
        
        if (!existsInCloud) {
          try {
            await DatabaseService.saveHabit({
              ...habit,
              id: `migrated_${habit.id}` // Ensure unique ID
            });
            habitsMigrated++;
            console.log(`Migrated habit: ${habit.name}`);
          } catch (error) {
            console.warn(`Failed to migrate habit ${habit.name}:`, error);
          }
        }
      }
    }
    
    // Mark migration as completed
    localStorage.setItem('cloudMigrationCompleted', 'true');
    
    console.log(`Migration completed: ${entriesMigrated} entries, ${habitsMigrated} habits`);
    
    return {
      entriesMigrated,
      habitsMigrated,
      success: true
    };
    
  } catch (error) {
    console.error('Data migration failed:', error);
    return {
      entriesMigrated: 0,
      habitsMigrated: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if migration has already been completed for this browser
 */
export function isMigrationCompleted(): boolean {
  return localStorage.getItem('cloudMigrationCompleted') === 'true';
}

/**
 * Reset migration flag (for testing purposes)
 */
export function resetMigrationFlag(): void {
  localStorage.removeItem('cloudMigrationCompleted');
}

/**
 * Get localStorage data for backup/export purposes
 */
export function getLocalStorageData(): {
  entries: DailyEntry[];
  habits: Habit[];
  hasData: boolean;
} {
  try {
    const savedEntries = localStorage.getItem('dailyEntries');
    const savedHabits = localStorage.getItem('habits');
    
    const entries: DailyEntry[] = savedEntries ? JSON.parse(savedEntries) : [];
    const habits: Habit[] = savedHabits ? JSON.parse(savedHabits) : [];
    
    return {
      entries,
      habits,
      hasData: entries.length > 0 || habits.length > 0
    };
  } catch (error) {
    console.error('Error reading localStorage data:', error);
    return {
      entries: [],
      habits: [],
      hasData: false
    };
  }
}
