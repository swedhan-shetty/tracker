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
    <div className="fade-in">
      <h2 className="section-title">
        <span className="material-icons">insights</span>
        Key Metrics
      </h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="material-icons icon-lg" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>article</span>
          <div className="metric-value">{entries.length}</div>
          <div className="metric-label">Total Entries</div>
        </div>

        <div className="metric-card">
          <span className="material-icons icon-lg" style={{ color: 'var(--color-warning)', marginBottom: 'var(--spacing-3)' }}>local_fire_department</span>
          <div className="metric-value">{getStreakCount()}</div>
          <div className="metric-label">Day Streak</div>
        </div>

        <div className="metric-card">
          <span className="material-icons icon-lg" style={{ color: 'var(--color-success)', marginBottom: 'var(--spacing-3)' }}>mood</span>
          <div className="metric-value">{getAverageMood()}<span style={{ fontSize: 'var(--font-size-lg)', opacity: 0.7 }}>/10</span></div>
          <div className="metric-label">Average Mood</div>
        </div>

        <div className="metric-card">
          <span className="material-icons icon-lg" style={{ color: 'var(--color-info)', marginBottom: 'var(--spacing-3)' }}>track_changes</span>
          <div className="metric-value">{habits.length}</div>
          <div className="metric-label">Active Habits</div>
        </div>
      </div>

      <h2 className="section-title">
        <span className="material-icons">today</span>
        Today's Entry
      </h2>

      {todaysEntry ? (
        <div className="card">
          <div className="flex gap-6 mb-6">
            <div className="metric-card" style={{ flex: 1 }}>
              <span className="material-icons" style={{ color: 'var(--color-success)', marginBottom: 'var(--spacing-2)' }}>mood</span>
              <div className="metric-value text-2xl">{todaysEntry.mood}/10</div>
              <div className="metric-label">Mood</div>
            </div>
            <div className="metric-card" style={{ flex: 1 }}>
              <span className="material-icons" style={{ color: 'var(--color-warning)', marginBottom: 'var(--spacing-2)' }}>battery_charging_full</span>
              <div className="metric-value text-2xl">{todaysEntry.energy}/10</div>
              <div className="metric-label">Energy</div>
            </div>
            <div className="metric-card" style={{ flex: 1 }}>
              <span className="material-icons" style={{ color: 'var(--color-info)', marginBottom: 'var(--spacing-2)' }}>trending_up</span>
              <div className="metric-value text-2xl">{todaysEntry.productivity}/10</div>
              <div className="metric-label">Productivity</div>
            </div>
            <div className="metric-card" style={{ flex: 1 }}>
              <span className="material-icons" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-2)' }}>bedtime</span>
              <div className="metric-value text-2xl">{todaysEntry.sleep}h</div>
              <div className="metric-label">Sleep</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="material-icons" style={{ color: todaysEntry.exercise ? 'var(--color-success)' : 'var(--color-text-muted)' }}>fitness_center</span>
            <span className={`font-medium ${todaysEntry.exercise ? 'text-primary' : 'text-muted'}`}>
              Exercise: {todaysEntry.exercise ? 'Completed' : 'Not done'}
            </span>
            <span className="material-icons" style={{ color: todaysEntry.exercise ? 'var(--color-success)' : 'var(--color-error)' }}>
              {todaysEntry.exercise ? 'check_circle' : 'cancel'}
            </span>
          </div>
          
          {todaysEntry.notes && (
            <div className="card" style={{ background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)' }}>
              <div className="flex items-start gap-3">
                <span className="material-icons text-muted">notes</span>
                <div>
                  <div className="font-medium mb-2">Notes</div>
                  <p className="text-secondary">{todaysEntry.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <span className="material-icons">edit_calendar</span>
          <h3>No entry for today</h3>
          <p>Start tracking your day by creating a new entry!</p>
        </div>
      )}

      <h2 className="section-title">
        <span className="material-icons">history</span>
        Recent Entries
      </h2>

      {getRecentEntries().length > 0 ? (
        <div className="flex-col gap-4">
          {getRecentEntries().map(entry => (
            <div key={entry.id} className="card">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="material-icons text-primary">calendar_today</span>
                  <div>
                    <div className="font-medium">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-secondary">
                      {new Date(entry.date).getFullYear()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="material-icons icon-sm" style={{ color: 'var(--color-success)' }}>mood</span>
                    <span className="text-sm font-medium">{entry.mood}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons icon-sm" style={{ color: 'var(--color-warning)' }}>battery_charging_full</span>
                    <span className="text-sm font-medium">{entry.energy}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons icon-sm" style={{ color: 'var(--color-primary)' }}>bedtime</span>
                    <span className="text-sm font-medium">{entry.sleep}h</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="material-icons">history</span>
          <h3>No entries yet</h3>
          <p>Start by creating your first daily entry!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
