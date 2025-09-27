import React, { useState } from 'react';
import { useWorkoutTracker } from '../../hooks/useWorkoutTracker';
import { WorkoutView } from '../../types/workout';
import WorkoutCalendar from './WorkoutCalendar';
import ActiveWorkout from './ActiveWorkout';
import WorkoutProgress from './WorkoutProgress';
import WorkoutHistory from './WorkoutHistory';

const WorkoutTracker: React.FC = () => {
  const {
    currentSession,
    progressStats,
  } = useWorkoutTracker();

  const [currentView, setCurrentView] = useState<WorkoutView>(
    currentSession ? 'active' : 'calendar'
  );

  const renderNavigation = () => (
    <nav style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
      {[
        { id: 'calendar', label: 'Calendar', icon: '📅' },
        { id: 'active', label: 'Active Workout', icon: '💪', disabled: !currentSession },
        { id: 'progress', label: 'Progress', icon: '📈' },
        { id: 'history', label: 'History', icon: '📋' },
      ].map(nav => (
        <button
          key={nav.id}
          onClick={() => setCurrentView(nav.id as WorkoutView)}
          disabled={nav.disabled}
          className={`btn ${currentView === nav.id ? 'btn--primary' : 'btn--outline'} btn--sm`}
          style={{
            opacity: nav.disabled ? 0.5 : 1,
            cursor: nav.disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <span style={{ marginRight: 'var(--space-4)' }}>{nav.icon}</span>
          {nav.label}
        </button>
      ))}
    </nav>
  );

  const renderQuickStats = () => (
    <div className="metrics-grid" style={{
      marginBottom: 'var(--space-6)',
    }}>
      <div className="metric-card">
        <div className="metric-card__header">
          <div className="metric-card__info">
            <div className="metric-card__title">This Week</div>
          </div>
        </div>
        <div className="metric-card__value-container">
          <span className="metric-card__value" style={{ color: 'var(--color-primary)' }}>
            {progressStats.weeklyCompleted}/{progressStats.weeklyGoal}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card__header">
          <div className="metric-card__info">
            <div className="metric-card__title">Current Streak</div>
          </div>
        </div>
        <div className="metric-card__value-container">
          <span className="metric-card__value" style={{ color: 'var(--color-success)' }}>
            {progressStats.currentStreak}
          </span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card__header">
          <div className="metric-card__info">
            <div className="metric-card__title">Avg Duration</div>
          </div>
        </div>
        <div className="metric-card__value-container">
          <span className="metric-card__value" style={{ color: 'var(--color-info)' }}>
            {Math.round(progressStats.averageDuration)}<span className="metric-card__unit">min</span>
          </span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card__header">
          <div className="metric-card__info">
            <div className="metric-card__title">Total Volume</div>
          </div>
        </div>
        <div className="metric-card__value-container">
          <span className="metric-card__value" style={{ color: 'var(--color-warning)' }}>
            {Math.round(progressStats.totalVolume)}<span className="metric-card__unit">kg</span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return <WorkoutCalendar />;
      case 'active':
        return currentSession ? <ActiveWorkout /> : <div>No active workout</div>;
      case 'progress':
        return <WorkoutProgress />;
      case 'history':
        return <WorkoutHistory />;
      default:
        return <WorkoutCalendar />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)', 
      color: 'var(--color-text)' 
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-16) 0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-16)',
          flexWrap: 'wrap',
          maxWidth: 'var(--container-xl)',
          margin: '0 auto',
          padding: '0 var(--space-16)',
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--color-text)' 
          }}>
            💪 Workout Tracker
          </h1>
          {renderNavigation()}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: 'var(--space-24)', 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto' 
      }}>
        {/* Quick Stats */}
        {currentView === 'calendar' && renderQuickStats()}
        
        {/* View Content */}
        <div className="fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Active Workout Indicator */}
      {currentSession && currentView !== 'active' && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--space-16)',
          right: 'var(--space-16)',
          background: 'var(--color-primary)',
          color: 'var(--color-btn-primary-text)',
          padding: 'var(--space-12) var(--space-16)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          zIndex: 1000,
          animation: 'pulse 2s infinite',
        }}
        onClick={() => setCurrentView('active')}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            🔥 Active: {currentSession.templateName}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
            Click to continue
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default WorkoutTracker;