import React from 'react';
import { DatabaseService } from '../services/databaseService';

interface HeaderProps {
  currentView: 'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'macros' | 'export-test';
  onViewChange: (view: 'dashboard' | 'entry' | 'analytics' | 'tasks' | 'supplements' | 'macros' | 'export-test') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSignOut = async () => {
    try {
      await DatabaseService.signOut();
      // Auth state change will be handled by App component
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <h1>Daily Tracker</h1>
          <p className="date">{today}</p>
        </div>
        
        <nav className="navigation">
          <button
            className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-button ${currentView === 'entry' ? 'active' : ''}`}
            onClick={() => onViewChange('entry')}
          >
            ✏️ Daily Entry
          </button>
          <button
            className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => onViewChange('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={`nav-button ${currentView === 'tasks' ? 'active' : ''}`}
            onClick={() => onViewChange('tasks')}
          >
            ✅ Tasks
          </button>
          <button
            className={`nav-button ${currentView === 'supplements' ? 'active' : ''}`}
            onClick={() => onViewChange('supplements')}
          >
            💊 Supplements
          </button>
          <button
            className={`nav-button ${currentView === 'macros' ? 'active' : ''}`}
            onClick={() => onViewChange('macros')}
          >
            🥗 Macros
          </button>
          <button
            className={`nav-button ${currentView === 'export-test' ? 'active' : ''}`}
            onClick={() => onViewChange('export-test')}
            style={{ fontSize: '12px', opacity: 0.7 }}
          >
            📥 Export Test
          </button>
          <button
            className="nav-button"
            onClick={handleSignOut}
            style={{ marginLeft: '1rem', background: '#7f1d1d', borderColor: '#991b1b' }}
          >
            🚪 Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
