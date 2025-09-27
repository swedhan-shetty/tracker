import React, { useState, useEffect } from 'react';
import './assets/modern-ui-system.css';
import { DailyEntry, Habit } from './types';
import Dashboard from './components/Dashboard';
import DailyEntryForm from './components/DailyEntryForm';
import SimpleTasksComponent from './components/SimpleTasksComponent';
import { SupplementArchive } from './components/supplements';
import Analytics from './components/Analytics';
import { WorkoutTracker } from './components/workout';
import ExportTest from './components/ExportTest';
import Macros from './components/macros/Macros';
import BookTracker from './components/BookTracker';

// Beautiful Sidebar Navigation Component
const SidebarNavigation: React.FC<{
  currentView: string;
  onViewChange: (view: 'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'workouts' | 'macros' | 'export-test' | 'books') => void;
}> = ({ currentView, onViewChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you could implement actual theme switching if needed
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { key: 'entry', label: 'Daily Entry', icon: 'edit_note' },
    { key: 'analytics', label: 'Analytics', icon: 'analytics' },
    { key: 'tasks', label: 'Tasks', icon: 'task_alt' },
    { key: 'supplements', label: 'Supplement Archive', icon: 'medication' },
    { key: 'workouts', label: 'Workouts', icon: 'fitness_center' },
    { key: 'macros', label: 'Macros', icon: 'restaurant' },
    { key: 'books', label: 'Books', icon: 'menu_book' },
    { key: 'export-test', label: 'Export', icon: 'download' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>
          <span className="material-icons icon-sm">dashboard</span>
          Daily Tracker
        </h2>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          <span className="material-icons icon-sm">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
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
                <span className="material-icons">{item.icon}</span>
                {item.label}
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'workouts' | 'macros' | 'export-test' | 'books'>('dashboard');

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
      case 'supplements': return 'Supplement Archive';
      case 'workouts': return 'Workout Tracker';
      case 'macros': return 'Macro Tracking';
      case 'books': return 'Book Library';
      case 'export-test': return 'Data Export';
      default: return 'Dashboard';
    }
  };

  // Get header icons
  const getHeaderIcon = () => {
    switch (currentView) {
      case 'dashboard': return 'dashboard';
      case 'entry': return 'edit_note';
      case 'analytics': return 'analytics';
      case 'tasks': return 'task_alt';
      case 'supplements': return 'medication';
      case 'workouts': return 'fitness_center';
      case 'macros': return 'restaurant';
      case 'books': return 'menu_book';
      case 'export-test': return 'download';
      default: return 'dashboard';
    }
  };

  return (
    <div className="app-container">
      <SidebarNavigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="main-content">
        <div className="section-header">
          <div>
            <h1>
              <span className="material-icons">{getHeaderIcon()}</span>
              {getSectionTitle()}
            </h1>
            <p>{today}</p>
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
            <SupplementArchive />
          )}
          
          {currentView === 'workouts' && (
            <WorkoutTracker />
          )}
          
          {currentView === 'macros' && (
            <Macros />
          )}
          
          {currentView === 'export-test' && (
            <ExportTest />
          )}
          
          {currentView === 'books' && (
            <BookTracker />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
