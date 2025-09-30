const fs = require('fs');
const path = require('path');

console.log('🚀 Enabling Cloud Database Mode');
console.log('===============================\n');

// Read the current App.tsx file
const appPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Replace the localStorage-only logic with database logic
const oldStartupLogic = `        // For now, always use localStorage to avoid loading issues
        console.log('Using localStorage mode by default');
        setUseLocalStorage(true);
        loadDataFromLocalStorage();
        setLoading(false);
        return;

        // Original database logic (commented out for now)
        /*
        const useLocal = localStorage.getItem('use-local-storage') === 'true';
        if (useLocal) {
          setUseLocalStorage(true);
          loadDataFromLocalStorage();
          setLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          try {
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
        */`;

const newStartupLogic = `        // Check if user wants to use localStorage only
        const useLocal = localStorage.getItem('use-local-storage') === 'true';
        if (useLocal) {
          setUseLocalStorage(true);
          loadDataFromLocalStorage();
          setLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          try {
            await loadDataFromDatabase();
            const hasLocalData = localStorage.getItem('dailyEntries') || localStorage.getItem('habits');
            if (hasLocalData) {
              setShowMigration(true);
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
            setDatabaseError(true);
          }
        }`;

// Replace the startup logic
appContent = appContent.replace(oldStartupLogic, newStartupLogic);

// Enable the auth listener
const oldAuthListener = `    // Skip auth listener for now to avoid issues
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(...);
    // return () => subscription.unsubscribe();`;

const newAuthListener = `    // Listen for auth changes
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

    return () => subscription.unsubscribe();`;

appContent = appContent.replace(oldAuthListener, newAuthListener);

// Fix entry functions to use database
const oldAddEntry = `  const addEntry = async (entry: DailyEntry) => {
    try {
      // For now, always use localStorage (simplified)
      const newEntries = [...entries, entry];
      setEntries(newEntries);
      // localStorage sync happens in useEffect
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Failed to save entry. Please try again.');
    }
  };`;

const newAddEntry = `  const addEntry = async (entry: DailyEntry) => {
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
  };`;

appContent = appContent.replace(oldAddEntry, newAddEntry);

const oldUpdateEntry = `  const updateEntry = async (updatedEntry: DailyEntry) => {
    try {
      // For now, always use localStorage (simplified)
      const newEntries = entries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      setEntries(newEntries);
      // localStorage sync happens in useEffect
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Failed to update entry. Please try again.');
    }
  };`;

const newUpdateEntry = `  const updateEntry = async (updatedEntry: DailyEntry) => {
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
  };`;

appContent = appContent.replace(oldUpdateEntry, newUpdateEntry);

// Enable the UI screens
const oldUILogic = `  // Skip all database/auth screens for now - go straight to app
  // (Database setup and migration logic removed for simplicity)`;

const newUILogic = `  // Show database setup if there are database errors
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
  }`;

appContent = appContent.replace(oldUILogic, newUILogic);

// Fix header
const oldHeader = `          <div className="header-actions">
            <span className="storage-mode">📱 Local Storage Mode</span>
          </div>`;

const newHeader = `          <div className="header-actions">
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
          </div>`;

appContent = appContent.replace(oldHeader, newHeader);

// Write the updated file
fs.writeFileSync(appPath, appContent, 'utf8');

console.log('✅ App.tsx updated for database mode');
console.log('📝 Next steps:');
console.log('1. Check that Supabase is online: node check-database.js');
console.log('2. Build and deploy: npm run build && netlify deploy --prod --dir=build');
console.log('\n🎉 Cloud backup will be enabled!');