import React, { useState, useEffect } from 'react';
import './NewApp.css';
import { DailyEntry, Habit } from './types';
import Dashboard from './components/Dashboard';
import DailyEntryForm from './components/DailyEntryForm';
import SimpleTasksComponent from './components/SimpleTasksComponent';
import SupplementManager from './components/SupplementManager';
import Analytics from './components/Analytics';
import ExportTest from './components/ExportTest';
import Macros from './components/macros/Macros';

// Beautiful Sidebar Navigation Component
const SidebarNavigation: React.FC<{
  currentView: string;
  onViewChange: (view: 'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'macros' | 'export-test') => void;
}> = ({ currentView, onViewChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you could implement actual theme switching if needed
  };

  const navItems = [
    { key: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { key: 'entry', label: '✏️ Daily Entry', icon: '✏️' },
    { key: 'analytics', label: '📈 Analytics', icon: '📈' },
    { key: 'tasks', label: '✅ Tasks', icon: '✅' },
    { key: 'supplements', label: '💊 Supplements', icon: '💊' },
    { key: 'macros', label: '🥗 Macros', icon: '🥗' },
    { key: 'export-test', label: '📥 Export', icon: '📥' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>📈 Daily Tracker</h2>
        <button 
          className="theme-toggle btn btn--sm btn--secondary"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <nav>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                className={`nav-item ${currentView === item.key ? 'active' : ''}`}
                onClick={() => onViewChange(item.key as any)}
              >
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label.replace(/^[^\s]+\s/, '')}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

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

  // Get today's date for header
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get section titles
  const getSectionTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'entry': return 'Daily Entry';
      case 'analytics': return 'Analytics & Insights';
      case 'tasks': return 'Task Management';
      case 'supplements': return 'Supplement Tracker';
      case 'macros': return 'Macro Tracking';
      case 'export-test': return 'Data Export';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="app-container">
      <SidebarNavigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="main-content">
        <div className="section-header">
          <div>
            <h1>{getSectionTitle()}</h1>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: 'var(--color-text-secondary)', 
              fontSize: 'var(--font-size-sm)' 
            }}>
              {today}
            </p>
          </div>
        </div>

        <div className="content-section active">
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
          
          {currentView === 'macros' && (
            <Macros />
          )}
          
          {currentView === 'export-test' && (
            <ExportTest />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
