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
// Temporarily disable Supabase to debug white screen
// import { supabase } from './lib/supabase';
// import { Auth } from './components/Auth';
// import { DatabaseService } from './services/databaseService';
// import { migrateLocalStorageToCloud, isMigrationCompleted, getLocalStorageData } from './utils/dataMigration';

function App() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'macros' | 'export-test'>('dashboard');
  // Temporarily skip authentication for debugging
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authChecked, setAuthChecked] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Simple localStorage data loading for debugging
  const loadLocalData = () => {
    try {
      const savedEntries = localStorage.getItem('dailyEntries');
      const savedHabits = localStorage.getItem('habits');
      
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
      
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (err) {
      console.error('Error loading localStorage data:', err);
    }
  };

  // Simple data loading on mount for debugging
  useEffect(() => {
    loadLocalData();
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

  const addEntry = (entry: DailyEntry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(newEntries));
  };

  const updateEntry = (updatedEntry: DailyEntry) => {
    const newEntries = entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    setEntries(newEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(newEntries));
  };

  const addHabit = (habit: Habit) => {
    const newHabits = [...habits, habit];
    setHabits(newHabits);
    localStorage.setItem('habits', JSON.stringify(newHabits));
  };

  const getTodaysEntry = (): DailyEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  // Skip authentication for debugging
  // if (!authChecked) {
  //   return <div className="auth-container"><div className="auth-form"><h2>Loading...</h2></div></div>;
  // }

  // if (!isAuthenticated) {
  //   return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  // }

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
