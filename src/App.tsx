import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry'>('dashboard');

  return (
    <div className="App" style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>📈 Daily Tracker</h1>
        <p>Debugging step by step...</p>
        
        <nav style={{ marginTop: '1rem' }}>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{
              marginRight: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: currentView === 'dashboard' ? '#4f46e5' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('entry')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentView === 'entry' ? '#4f46e5' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Entry
          </button>
        </nav>
      </div>
      
      <main>
        {currentView === 'dashboard' && (
          <div>
            <h2>🏠 Dashboard</h2>
            <p>Dashboard is working! This would show your entries and stats.</p>
            <div style={{ 
              backgroundColor: '#374151',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              <h3>Quick Stats</h3>
              <p>• Total entries: Coming soon</p>
              <p>• Current streak: Coming soon</p>
              <p>• Average mood: Coming soon</p>
            </div>
          </div>
        )}
        
        {currentView === 'entry' && (
          <div>
            <h2>✍️ Daily Entry</h2>
            <p>Entry form is working! This would let you track your daily metrics.</p>
            <div style={{ 
              backgroundColor: '#374151',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              <h3>Today's Entry</h3>
              <p>• Mood: Not yet tracked</p>
              <p>• Energy: Not yet tracked</p>
              <p>• Productivity: Not yet tracked</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
