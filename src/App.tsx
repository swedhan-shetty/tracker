import React, { useState } from 'react';
import './App.css';

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
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'analytics'>('dashboard');

  return (
    <div className="App" style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '1rem'
    }}>
      <SimpleHeader currentView={currentView} onViewChange={setCurrentView} />
      
      <main>
        {currentView === 'dashboard' && (
          <div>
            <h2>🏠 Dashboard</h2>
            <p>Your personal tracking overview</p>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ backgroundColor: '#374151', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3>📊 Quick Stats</h3>
                <p>• Total entries: 0</p>
                <p>• Current streak: 0 days</p>
                <p>• Average mood: N/A</p>
              </div>
              <div style={{ backgroundColor: '#374151', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3>📅 Today's Status</h3>
                <p>• Entry completed: No</p>
                <p>• Goals set: 0</p>
                <p>• Habits tracked: 0</p>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'entry' && (
          <div>
            <h2>✍️ Daily Entry</h2>
            <p>Track your daily metrics and progress</p>
            <div style={{ 
              backgroundColor: '#374151',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              <h3>Today's Entry Form</h3>
              <p style={{ marginBottom: '1rem' }}>This is where you would track:</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>😊 Mood (1-10 scale)</li>
                <li style={{ marginBottom: '0.5rem' }}>⚡ Energy level (1-10 scale)</li>
                <li style={{ marginBottom: '0.5rem' }}>🎥 Productivity (1-10 scale)</li>
                <li style={{ marginBottom: '0.5rem' }}>😴 Sleep hours</li>
                <li style={{ marginBottom: '0.5rem' }}>🏃 Exercise minutes</li>
                <li style={{ marginBottom: '0.5rem' }}>🎢 Daily goals</li>
                <li style={{ marginBottom: '0.5rem' }}>✅ Habits checklist</li>
              </ul>
            </div>
          </div>
        )}
        
        {currentView === 'analytics' && (
          <div>
            <h2>📈 Analytics</h2>
            <p>Visualize your progress and trends over time</p>
            <div style={{ 
              backgroundColor: '#374151',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginTop: '1rem',
              textAlign: 'center'
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
