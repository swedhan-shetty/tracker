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
    <div className="dashboard-grid">
      <div className="card">
        <div className="card__body">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{entries.length}</span>
              <span className="stat-label">📝 Total Entries</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">{getStreakCount()}</span>
              <span className="stat-label">🔥 Day Streak</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">{getAverageMood()}/10</span>
              <span className="stat-label">😊 Avg Mood</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">{habits.length}</span>
              <span className="stat-label">🎯 Active Habits</span>
            </div>
          </div>
        </div>
      </div>

      {todaysEntry ? (
        <div className="card">
          <div className="card__body">
            <h3 style={{ marginBottom: 'var(--space-16)' }}>Today's Entry</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{todaysEntry.mood}/10</span>
                <span className="stat-label">😊 Mood</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{todaysEntry.energy}/10</span>
                <span className="stat-label">⚡ Energy</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{todaysEntry.productivity}/10</span>
                <span className="stat-label">🎯 Productivity</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{todaysEntry.sleep}h</span>
                <span className="stat-label">😴 Sleep</span>
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-16)', textAlign: 'center' }}>
              <span style={{ 
                color: todaysEntry.exercise ? 'var(--color-success)' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-lg)' 
              }}>
                🏃‍♂️ Exercise: {todaysEntry.exercise ? '✅' : '❌'}
              </span>
            </div>
            {todaysEntry.notes && (
              <div style={{ 
                marginTop: 'var(--space-16)', 
                padding: 'var(--space-12)', 
                backgroundColor: 'var(--color-bg-1)', 
                borderRadius: 'var(--radius-base)', 
                fontSize: 'var(--font-size-sm)' 
              }}>
                <strong>Notes:</strong> {todaysEntry.notes}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card__body" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-text-secondary)' }}>No entry for today</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Start tracking your day by creating a new entry!</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card__body">
          <h3 style={{ marginBottom: 'var(--space-16)' }}>Recent Entries</h3>
          {getRecentEntries().length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              {getRecentEntries().map(entry => (
                <div key={entry.id} style={{
                  padding: 'var(--space-12)',
                  backgroundColor: 'var(--color-bg-1)',
                  borderRadius: 'var(--radius-base)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-8)'
                  }}>
                    <strong style={{ color: 'var(--color-text)' }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </strong>
                    <div style={{ 
                      display: 'flex', 
                      gap: 'var(--space-16)', 
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <span>😊 {entry.mood}/10</span>
                      <span>⚡ {entry.energy}/10</span>
                      <span>😴 {entry.sleep}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--color-text-secondary)', 
              fontStyle: 'italic' 
            }}>
              No entries yet. Start by creating your first daily entry!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
