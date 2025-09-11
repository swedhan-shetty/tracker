import React from 'react';
import { DailyEntry, Habit } from '../types';

interface DashboardProps {
  entries: DailyEntry[];
  habits: Habit[];
  todaysEntry?: DailyEntry;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, habits, todaysEntry }) => {
  const getRecentEntries = () => {
    return entries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  const getAverageMood = () => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.mood, 0);
    return (total / entries.length).toFixed(1);
  };

  const getStreakCount = () => {
    // Simple streak calculation - consecutive days with entries
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
      currentDate = entryDate;
    }
    
    return streak;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Entries</h3>
            <p className="stat-number">{entries.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <p className="stat-number">{getStreakCount()} days</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">😊</div>
          <div className="stat-content">
            <h3>Avg Mood</h3>
            <p className="stat-number">{getAverageMood()}/10</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Active Habits</h3>
            <p className="stat-number">{habits.length}</p>
          </div>
        </div>
      </div>

      {todaysEntry ? (
        <div className="todays-summary">
          <h3>Today's Entry</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Mood:</span>
              <span className="value">{todaysEntry.mood}/10</span>
            </div>
            <div className="summary-item">
              <span className="label">Energy:</span>
              <span className="value">{todaysEntry.energy}/10</span>
            </div>
            <div className="summary-item">
              <span className="label">Productivity:</span>
              <span className="value">{todaysEntry.productivity}/10</span>
            </div>
            <div className="summary-item">
              <span className="label">Sleep:</span>
              <span className="value">{todaysEntry.sleep} hours</span>
            </div>
            <div className="summary-item">
              <span className="label">Exercise:</span>
              <span className="value">{todaysEntry.exercise ? '✅' : '❌'}</span>
            </div>
          </div>
          {todaysEntry.notes && (
            <div className="notes-preview">
              <strong>Notes:</strong> {todaysEntry.notes}
            </div>
          )}
        </div>
      ) : (
        <div className="no-entry-today">
          <h3>No entry for today</h3>
          <p>Start tracking your day by creating a new entry!</p>
        </div>
      )}

      <div className="recent-entries">
        <h3>Recent Entries</h3>
        {getRecentEntries().length > 0 ? (
          <div className="entries-list">
            {getRecentEntries().map(entry => (
              <div key={entry.id} className="entry-item">
                <div className="entry-date">
                  {new Date(entry.date).toLocaleDateString()}
                </div>
                <div className="entry-summary">
                  <span>Mood: {entry.mood}/10</span>
                  <span>Energy: {entry.energy}/10</span>
                  <span>Sleep: {entry.sleep}h</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No entries yet. Start by creating your first daily entry!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
