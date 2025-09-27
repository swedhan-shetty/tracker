import React from 'react';
import { useWorkoutTracker } from '../../hooks/useWorkoutTracker';
import { CalendarDay } from '../../types/workout';

const WorkoutCalendar: React.FC = () => {
  const {
    calendarDays,
    startWorkout,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  } = useWorkoutTracker();

  const getStatusColor = (status: CalendarDay['status']) => {
    switch (status) {
      case 'completed':
        return 'var(--color-success)';
      case 'planned':
        return 'var(--color-primary)';
      case 'missed':
        return 'var(--color-error)';
      case 'rest':
        return 'var(--color-info)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const getStatusIcon = (status: CalendarDay['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'planned':
        return '📝';
      case 'missed':
        return '❌';
      case 'rest':
        return '😴';
      default:
        return '⚪';
    }
  };

  const formatWeekRange = () => {
    if (calendarDays.length === 0) return '';
    
    const firstDay = new Date(calendarDays[0].date);
    const lastDay = new Date(calendarDays[6].date);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric',
      year: firstDay.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    return `${firstDay.toLocaleDateString('en-US', options)} - ${lastDay.toLocaleDateString('en-US', options)}`;
  };

  const handleStartWorkout = (day: CalendarDay) => {
    if (day.workout && !day.session?.completed) {
      startWorkout(day.workout.id, day.date);
    }
  };

  const renderDayCard = (day: CalendarDay) => (
    <div
      key={day.date}
      className={`metric-card ${day.isToday ? 'metric-card--today' : ''}`}
      style={{
        position: 'relative',
        border: day.isToday ? `2px solid ${getStatusColor(day.status)}` : undefined,
        background: day.isToday ? `${getStatusColor(day.status)}10` : undefined,
      }}
    >
      <div className="metric-card__header" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Day Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-12)',
        }}>
          <div>
            <div style={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text)',
            }}>
              {day.dayName}
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-secondary)',
            }}>
              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
          
          {day.isToday && (
            <div className="status-badge status-badge--info">
              Today
            </div>
          )}
        </div>

        {/* Workout Info */}
        {day.workout ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-12)',
            marginBottom: 'var(--space-16)',
            padding: 'var(--space-12)',
            backgroundColor: `${day.workout.color}15`,
            borderRadius: 'var(--radius-base)',
            border: `1px solid ${day.workout.color}30`,
          }}>
            <div style={{ fontSize: 'var(--font-size-xl)' }}>
              {day.workout.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-4)',
              }}>
                {day.workout.name}
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                {day.workout.exercises.length} exercises • ~{day.workout.estimatedDuration}min
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-12)',
            marginBottom: 'var(--space-16)',
            padding: 'var(--space-12)',
            backgroundColor: 'var(--color-secondary)',
            borderRadius: 'var(--radius-base)',
          }}>
            <div style={{ fontSize: 'var(--font-size-xl)' }}>😴</div>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>
                Rest Day
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Recovery & Rest
              </div>
            </div>
          </div>
        )}

        {/* Status and Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
          }}>
            <span style={{ fontSize: 'var(--font-size-lg)' }}>
              {getStatusIcon(day.status)}
            </span>
            <span className={`status-badge status-badge--${day.status === 'completed' ? 'success' : day.status === 'missed' ? 'error' : day.status === 'rest' ? 'info' : 'warning'}`}>
              {day.status}
            </span>
          </div>

          {day.workout && day.status !== 'completed' && (
            <button
              onClick={() => handleStartWorkout(day)}
              className="btn btn--primary btn--sm"
              disabled={day.status === 'rest'}
            >
              {day.isToday ? 'Start Now' : 'Start Workout'}
            </button>
          )}

          {day.session?.completed && (
            <div style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              {day.session.duration}min • {day.session.totalSets} sets
            </div>
          )}
        </div>

        {/* Session Notes */}
        {day.session?.notes && (
          <div style={{
            marginTop: 'var(--space-12)',
            padding: 'var(--space-8)',
            backgroundColor: 'var(--color-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}>
            💭 {day.session.notes}
          </div>
        )}
      </div>
    </div>
  );

  const todaysWorkout = calendarDays.find(day => day.isToday);

  return (
    <div>
      {/* Week Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-24)',
        flexWrap: 'wrap',
        gap: 'var(--space-16)',
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
          }}>
            Weekly Schedule
          </h2>
          <div style={{ 
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-4)',
          }}>
            {formatWeekRange()}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={goToPreviousWeek}
            className="btn btn--outline btn--sm"
          >
            ← Previous
          </button>
          <button
            onClick={goToToday}
            className="btn btn--secondary btn--sm"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="btn btn--outline btn--sm"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Today's Workout Highlight */}
      {todaysWorkout && todaysWorkout.workout && todaysWorkout.status !== 'completed' && (
        <div className="metric-card" style={{ 
          marginBottom: 'var(--space-6)',
          background: `linear-gradient(135deg, ${todaysWorkout.workout.color}15, var(--color-surface))`,
          border: `2px solid ${todaysWorkout.workout.color}30`,
        }}>
          <div style={{ padding: 'var(--space-4)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-16)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
                <div style={{ fontSize: '3rem' }}>{todaysWorkout.workout.icon}</div>
                <div>
                  <h3 style={{ 
                    margin: 0,
                    fontSize: 'var(--font-size-xl)',
                    color: 'var(--color-text)',
                  }}>
                    Today's Workout: {todaysWorkout.workout.name}
                  </h3>
                  <div style={{ 
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--space-4)',
                  }}>
                    {todaysWorkout.workout.exercises.length} exercises • ~{todaysWorkout.workout.estimatedDuration} min
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStartWorkout(todaysWorkout)}
                className="btn btn--primary btn--lg"
              >
                🚀 Start Today's Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="metrics-grid" style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {calendarDays.map(renderDayCard)}
      </div>
    </div>
  );
};

export default WorkoutCalendar;