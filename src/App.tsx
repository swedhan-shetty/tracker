import React, { useState, useEffect } from 'react';
import './App.css';
import { DailyEntry, Goal, Habit } from './types';
import Dashboard from './components/Dashboard';
import DailyEntryForm from './components/DailyEntryForm';
import Header from './components/Header';
import SimpleTasksComponent from './components/SimpleTasksComponent';
import SupplementManager from './components/SupplementManager';
import Analytics from './components/Analytics';
import ExportTest from './components/ExportTest';
import Macros from './components/macros/Macros';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { DatabaseService } from './services/databaseService';
import { migrateLocalStorageToCloud, isMigrationCompleted, getLocalStorageData } from './utils/dataMigration';

function App() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'macros' | 'export-test'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load data from cloud database and handle migration
  const loadCloudData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if we need to migrate localStorage data first
      if (!isMigrationCompleted()) {
        const localData = getLocalStorageData();
        
        if (localData.hasData) {
          console.log('Migrating localStorage data to cloud...');
          const migrationResult = await migrateLocalStorageToCloud();
          
          if (migrationResult.success) {
            console.log(`Migration successful: ${migrationResult.entriesMigrated} entries, ${migrationResult.habitsMigrated} habits`);
          } else {
            console.warn('Migration failed:', migrationResult.error);
          }
        }
      }
      
      // Load data from cloud
      const [cloudEntries, cloudHabits] = await Promise.all([
        DatabaseService.getDailyEntries(),
        DatabaseService.getHabits()
      ]);
      
      setEntries(cloudEntries);
      setHabits(cloudHabits);
      
    } catch (err: any) {
      console.error('Error loading cloud data:', err);
      setError('Failed to load data from cloud');
      
      // Fallback to localStorage if cloud fails
      const savedEntries = localStorage.getItem('dailyEntries');
      const savedHabits = localStorage.getItem('habits');
      
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
      
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth session and subscribe to changes
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(!!session);
      setAuthChecked(true);
      
      // Load data from cloud when authenticated
      if (session) {
        await loadCloudData();
      }
    };
    init();
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      
      // Load data when user signs in
      if (session) {
        await loadCloudData();
      } else {
        // Clear data when user signs out
        setEntries([]);
        setHabits([]);
      }
    });
    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);


  // Save data to both cloud and localStorage (backup)
  useEffect(() => {
    if (isAuthenticated && entries.length > 0) {
      // Keep localStorage as backup
      localStorage.setItem('dailyEntries', JSON.stringify(entries));
    }
  }, [entries, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && habits.length > 0) {
      // Keep localStorage as backup
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, isAuthenticated]);

  const addEntry = async (entry: DailyEntry) => {
    setLoading(true);
    try {
      const savedEntry = await DatabaseService.saveDailyEntry(entry);
      setEntries(prev => [...prev, savedEntry]);
    } catch (err: any) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry');
      // Fallback to local state
      setEntries(prev => [...prev, entry]);
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (updatedEntry: DailyEntry) => {
    setLoading(true);
    try {
      const savedEntry = await DatabaseService.saveDailyEntry(updatedEntry);
      setEntries(prev => 
        prev.map(entry => 
          entry.id === updatedEntry.id ? savedEntry : entry
        )
      );
    } catch (err: any) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry');
      // Fallback to local state
      setEntries(prev => 
        prev.map(entry => 
          entry.id === updatedEntry.id ? updatedEntry : entry
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habit: Habit) => {
    setLoading(true);
    try {
      const savedHabit = await DatabaseService.saveHabit(habit);
      setHabits(prev => [...prev, savedHabit]);
    } catch (err: any) {
      console.error('Error saving habit:', err);
      setError('Failed to save habit');
      // Fallback to local state
      setHabits(prev => [...prev, habit]);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysEntry = (): DailyEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  if (!authChecked) {
    return <div className="auth-container"><div className="auth-form"><h2>Loading...</h2></div></div>;
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="App">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <main className="main-content">
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#ffffff' }}>Syncing data...</p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            background: '#7f1d1d', 
            color: '#ffffff', 
            padding: '1rem', 
            margin: '1rem', 
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            entries={entries}
            habits={habits}
            todaysEntry={getTodaysEntry()}
          />
        )}
        
        {currentView === 'entry' && (
          <DailyEntryForm
            habits={habits}
            existingEntry={getTodaysEntry()}
            onSave={getTodaysEntry() ? updateEntry : addEntry}
          />
        )}
        
        {currentView === 'analytics' && (
          <Analytics />
        )}
        
        {currentView === 'tasks' && (
          <SimpleTasksComponent />
        )}
        
        {currentView === 'supplements' && (
          <SupplementManager />
        )}
        
        {currentView === 'export-test' && (
          <ExportTest />
        )}
        
        {currentView === 'macros' && (
          <Macros />
        )}
      </main>
    </div>
  );
}

export default App;
