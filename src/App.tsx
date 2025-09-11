import React, { useState, useEffect } from 'react';
import './App.css';
import { DailyEntry, Habit } from './types';
import Dashboard from './components/Dashboard';
import DailyEntryForm from './components/DailyEntryForm';

// Simple Header component without DatabaseService dependency
const SimpleHeader: React.FC<{
  currentView: string;
  onViewChange: (view: 'dashboard' | 'entry' | 'analytics') => void;
}> = ({ currentView, onViewChange }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header style={{
      backgroundColor: '#16213e',
      padding: '1rem 2rem',
      marginBottom: '2rem',
      borderRadius: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>📈 Daily Tracker</h1>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8, fontSize: '0.875rem' }}>{today}</p>
        </div>
        
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onViewChange('dashboard')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentView === 'dashboard' ? '#4f46e5' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => onViewChange('entry')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentView === 'entry' ? '#4f46e5' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            ✏️ Entry
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentView === 'analytics' ? '#4f46e5' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            📈 Analytics
          </button>
        </nav>
      </div>
    </header>
  );
};

function App() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'analytics'>('dashboard');

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
    <div className="App" style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '1rem'
    }}>
      <SimpleHeader currentView={currentView} onViewChange={setCurrentView} />
      
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
          <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
            <h2>📈 Analytics</h2>
            <p>Visualize your progress and trends over time</p>
            <div style={{ 
              backgroundColor: '#374151',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              <h3>Coming Soon!</h3>
              <p>Analytics dashboard will include:</p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                <li>📉 Mood trends over time</li>
                <li>⚡ Energy patterns</li>
                <li>🎥 Productivity insights</li>
                <li>😴 Sleep quality analysis</li>
                <li>🏃 Exercise consistency</li>
                <li>🎆 Streak tracking</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
