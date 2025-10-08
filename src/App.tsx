import React, { useState, useEffect } from 'react';
import './assets/modern-ui-system.css';
import './components/auth-styles.css';
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
import { Auth } from './components/Auth';
import { DatabaseService } from './services/databaseService';
import { DatabaseSetup } from './components/DatabaseSetup';
import { supabase } from './lib/supabase';

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMigration, setShowMigration] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Check authentication status on startup
  useEffect(() => {
    // Immediate fallback timer in case of any issues
    const emergencyFallback = setTimeout(() => {
      console.log('Emergency fallback activated - using localStorage');
      setUseLocalStorage(true);
      loadDataFromLocalStorage();
      setLoading(false);
    }, 8000); // 8 second emergency fallback

    const checkUser = async () => {
      try {
        console.log('Starting authentication check...');
        console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Missing');
        console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
        
        // Always attempt authentication first - removed localStorage preference check

        // Set a timeout for auth check to prevent hanging
        const authTimeout = setTimeout(() => {
          console.log('Auth check timeout - falling back to localStorage');
          setUseLocalStorage(true);
          loadDataFromLocalStorage();
          setLoading(false);
        }, 5000); // 5 second timeout

        console.log('Checking Supabase auth...');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        clearTimeout(authTimeout);
        
        if (error) {
          console.log('Auth error:', error);
          throw error;
        }
        
        console.log('Auth check complete, user:', user ? 'logged in' : 'not logged in');
        setUser(user);
        
        if (user) {
          try {
            console.log('Loading data from database...');
            await loadDataFromDatabase();
            const hasLocalData = localStorage.getItem('dailyEntries') || localStorage.getItem('habits');
            if (hasLocalData) {
              setShowMigration(true);
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
            setDatabaseError(true);
          }
        }
      } catch (err) {
        console.error('Error in startup:', err);
        // Fallback to localStorage on any error
        console.log('Falling back to localStorage mode');
        setUseLocalStorage(true);
        loadDataFromLocalStorage();
      } finally {
        console.log('Setting loading to false');
        clearTimeout(emergencyFallback);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadDataFromDatabase();
      } else {
        // Clear data when logged out
        setEntries([]);
        setHabits([]);
      }
    });

    return () => {
      clearTimeout(emergencyFallback);
      subscription.unsubscribe();
    };
  }, []);

  // Sync to localStorage when in localStorage mode
  useEffect(() => {
    if (useLocalStorage && entries.length > 0) {
      localStorage.setItem('dailyEntries', JSON.stringify(entries));
    }
  }, [entries, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage && habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, useLocalStorage]);

  // Load data from database
  const loadDataFromDatabase = async () => {
    try {
      const [entriesData, habitsData] = await Promise.all([
        DatabaseService.getDailyEntries(),
        DatabaseService.getHabits()
      ]);
      
      setEntries(entriesData);
      setHabits(habitsData);
    } catch (err) {
      console.error('Error loading data from database:', err);
      throw err;
    }
  };

  // Load data from localStorage (fallback)
  const loadDataFromLocalStorage = () => {
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
      console.error('Error loading data from localStorage:', err);
    }
  };

  const addEntry = async (entry: DailyEntry) => {
    try {
      if (useLocalStorage) {
        // Use localStorage
        const newEntries = [...entries, entry];
        setEntries(newEntries);
      } else {
        // Use database
        const savedEntry = await DatabaseService.saveDailyEntry(entry);
        setEntries(prev => [...prev, savedEntry]);
      }
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Failed to save entry. Please try again.');
    }
  };

  const updateEntry = async (updatedEntry: DailyEntry) => {
    try {
      if (useLocalStorage) {
        // Use localStorage
        const newEntries = entries.map(entry => 
          entry.id === updatedEntry.id ? updatedEntry : entry
        );
        setEntries(newEntries);
      } else {
        // Use database
        const savedEntry = await DatabaseService.saveDailyEntry(updatedEntry);
        setEntries(prev => prev.map(entry => 
          entry.id === savedEntry.id ? savedEntry : entry
        ));
      }
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Failed to update entry. Please try again.');
    }
  };

  // Migration functions
  const handleMigration = async () => {
    try {
      setLoading(true);
      
      // Get existing localStorage data
      const localEntries = localStorage.getItem('dailyEntries');
      const localHabits = localStorage.getItem('habits');
      
      if (localEntries) {
        const entries: DailyEntry[] = JSON.parse(localEntries);
        for (const entry of entries) {
          await DatabaseService.saveDailyEntry(entry);
        }
      }
      
      if (localHabits) {
        const habits: Habit[] = JSON.parse(localHabits);
        for (const habit of habits) {
          await DatabaseService.saveHabit(habit);
        }
      }
      
      // Reload data from database
      await loadDataFromDatabase();
      
      // Clear localStorage after successful migration
      localStorage.removeItem('dailyEntries');
      localStorage.removeItem('habits');
      
      setShowMigration(false);
      alert('Data migrated successfully!');
    } catch (err) {
      console.error('Migration failed:', err);
      alert('Migration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const skipMigration = () => {
    setShowMigration(false);
  };

  const handleSignOut = async () => {
    try {
      await DatabaseService.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Daily Tracker...</p>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <p>Debug Info:</p>
          <p>Supabase URL: {process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Supabase Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>Mode: {useLocalStorage ? 'localStorage' : 'cloud'}</p>
        </div>
      </div>
    );
  }

  // Show database setup if there are database errors
  if (databaseError && !useLocalStorage) {
    return (
      <div className="app-container">
        <DatabaseSetup />
      </div>
    );
  }

  // Show authentication form if user is not logged in (and not using localStorage)
  if (!user && !useLocalStorage) {
    return (
      <div className="app-container">
        <Auth onAuthSuccess={() => {/* Authentication handled by useEffect */}} />
      </div>
    );
  }

  // Show migration prompt if user has local data
  if (showMigration) {
    return (
      <div className="app-container">
        <div className="migration-prompt">
          <div className="migration-card">
            <h2>🔄 Data Migration Available</h2>
            <p>
              We found data stored locally in your browser from previous sessions. 
              Would you like to migrate this data to your cloud account?
            </p>
            <div className="migration-actions">
              <button onClick={handleMigration} className="btn-primary">
                Yes, Migrate My Data
              </button>
              <button onClick={skipMigration} className="btn-secondary">
                Skip (I'll do this later)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="header-actions">
            {useLocalStorage ? (
              <span className="storage-mode">📱 Local Storage Mode</span>
            ) : (
              <>
                <span className="user-email">{user?.email}</span>
                <button onClick={handleSignOut} className="btn-outline">
                  <span className="material-icons">logout</span>
                  Sign Out
                </button>
              </>
            )}
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
