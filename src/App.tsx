import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App" style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontSize: '24px'
    }}>
      <h1>🎉 Daily Tracker is Working!</h1>
      <p>This is a test to debug the white screen issue.</p>
      <p>Build time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;
