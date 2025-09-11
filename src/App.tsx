import React, { useState, useEffect } from 'react';
import './App.css';
import { DailyEntry, Habit } from './types';
import Dashboard from './components/Dashboard';
import DailyEntryForm from './components/DailyEntryForm';
import Header from './components/Header';

function App() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'macros' | 'export-test'>('dashboard');

  // Load data from localStorage on startup
  useEffect(() => {
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
      console.error('Error loading data:', err);
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('dailyEntries', JSON.stringify(entries));
    }
  }, [entries]);

  // Save habits to localStorage when they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const addEntry = (entry: DailyEntry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
  };

  const updateEntry = (updatedEntry: DailyEntry) => {
    const newEntries = entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    setEntries(newEntries);
  };

  const getTodaysEntry = (): DailyEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  return (
    <div className="App">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <main className="main-content">
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
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>📊 Analytics</h2>
            <p>Analytics coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
