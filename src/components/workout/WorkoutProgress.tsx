import React from 'react';
import { useWorkoutTracker } from '../../hooks/useWorkoutTracker';

const WorkoutProgress: React.FC = () => {
  const { progressStats, workoutSessions } = useWorkoutTracker();

  const completedSessions = workoutSessions.filter(s => s.completed);

  const averageSessionTime = completedSessions.length > 0 
    ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length 
    : 0;

  return (
    <div>
      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-16)',
        marginBottom: 'var(--space-24)',
      }}>
        <div className="card">
          <div className="card__body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-8)' }}>🏋️</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
              {progressStats.totalWorkouts}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Total Workouts
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-8)' }}>📈</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
              {Math.round(progressStats.totalVolume)}kg
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Total Volume
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-8)' }}>⏱️</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
              {Math.round(averageSessionTime)}m
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Avg Session
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-8)' }}>🔥</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
              {progressStats.currentStreak}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card" style={{ marginBottom: 'var(--space-24)' }}>
        <div className="card__body">
          <h3 style={{ marginBottom: 'var(--space-16)' }}>Weekly Progress</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-12)',
          }}>
            <span>Workouts this week:</span>
            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {progressStats.weeklyCompleted} / {progressStats.weeklyGoal}
            </span>
          </div>
          <div style={{
            background: 'var(--color-secondary)',
            borderRadius: 'var(--radius-base)',
            height: '12px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                background: progressStats.weeklyCompleted >= progressStats.weeklyGoal 
                  ? 'var(--color-success)' 
                  : 'var(--color-primary)',
                height: '100%',
                width: `${Math.min((progressStats.weeklyCompleted / progressStats.weeklyGoal) * 100, 100)}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ 
            fontSize: 'var(--font-size-sm)', 
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-8)',
          }}>
            {progressStats.weeklyCompleted >= progressStats.weeklyGoal 
              ? '🎉 Weekly goal achieved!' 
              : `${progressStats.weeklyGoal - progressStats.weeklyCompleted} workouts remaining`}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <div className="card__body">
          <h3 style={{ marginBottom: 'var(--space-16)' }}>Recent Sessions</h3>
          {completedSessions.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-24)' }}>
              No completed sessions yet. Start your first workout!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-12)' }}>
              {completedSessions
                .slice(-5)
                .reverse()
                .map(session => (
                  <div
                    key={session.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto auto',
                      gap: 'var(--space-16)',
                      alignItems: 'center',
                      padding: 'var(--space-12)',
                      background: 'var(--color-secondary)',
                      borderRadius: 'var(--radius-base)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        {session.templateName}
                      </div>
                      <div style={{ 
                        fontSize: 'var(--font-size-sm)', 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {session.duration}m
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        Duration
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {session.totalSets}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        Sets
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {Math.round(session.totalVolume || 0)}kg
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        Volume
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutProgress;