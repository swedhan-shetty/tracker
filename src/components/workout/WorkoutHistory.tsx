import React, { useState } from 'react';
import { useWorkoutTracker } from '../../hooks/useWorkoutTracker';
import { WorkoutSession } from '../../types/workout';

const WorkoutHistory: React.FC = () => {
  const { workoutSessions } = useWorkoutTracker();
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const completedSessions = workoutSessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderSessionCard = (session: WorkoutSession) => (
    <div
      key={session.id}
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onClick={() => setSelectedSession(session)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="card__body">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-12)',
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
              {session.templateName}
            </h4>
            <div style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-4)',
            }}>
              {new Date(session.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="status-badge status-badge--success">
            Completed
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: 'var(--space-12)',
          marginBottom: 'var(--space-12)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-primary)',
            }}>
              {session.duration}m
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Duration
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-success)',
            }}>
              {session.totalSets}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Sets
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-info)',
            }}>
              {session.totalReps}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Reps
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-warning)',
            }}>
              {Math.round(session.totalVolume || 0)}kg
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Volume
            </div>
          </div>
        </div>

        {session.notes && (
          <div style={{
            padding: 'var(--space-8)',
            background: 'var(--color-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}>
            💭 {session.notes}
          </div>
        )}

        <div style={{
          marginTop: 'var(--space-8)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          textAlign: 'right',
        }}>
          Click to view details
        </div>
      </div>
    </div>
  );

  const renderSessionDetails = () => {
    if (!selectedSession) return null;

    const exerciseGroups = selectedSession.sets.reduce((groups, set) => {
      if (!groups[set.exerciseId]) {
        groups[set.exerciseId] = [];
      }
      groups[set.exerciseId].push(set);
      return groups;
    }, {} as Record<string, typeof selectedSession.sets>);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-16)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedSession(null);
        }
      }}>
        <div
          className="card"
          style={{
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <div className="card__body">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-20)',
            }}>
              <h3 style={{ margin: 0 }}>
                {selectedSession.templateName} - {new Date(selectedSession.date).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="btn btn--outline btn--sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Session Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--space-16)',
              marginBottom: 'var(--space-24)',
              padding: 'var(--space-16)',
              background: 'var(--color-secondary)',
              borderRadius: 'var(--radius-base)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                  {selectedSession.duration}m
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Duration
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                  {selectedSession.totalSets}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Sets
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                  {selectedSession.totalReps}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Reps
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                  {Math.round(selectedSession.totalVolume || 0)}kg
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Volume
                </div>
              </div>
            </div>

            {/* Exercise Breakdown */}
            <h4 style={{ marginBottom: 'var(--space-16)' }}>Exercise Breakdown</h4>
            <div style={{ display: 'grid', gap: 'var(--space-16)' }}>
              {Object.entries(exerciseGroups).map(([exerciseId, sets]) => (
                <div key={exerciseId}>
                  <h5 style={{ 
                    margin: '0 0 var(--space-8) 0',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-base)',
                  }}>
                    {exerciseId.replace(/_/g, ' ')}
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-8)',
                  }}>
                    {sets.map((set, index) => (
                      <div
                        key={set.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: 'var(--space-8)',
                          background: 'var(--color-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        <span>Set {set.setNumber}:</span>
                        <span>{set.reps} reps × {set.weight}kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedSession.notes && (
              <div style={{ marginTop: 'var(--space-20)' }}>
                <h4 style={{ marginBottom: 'var(--space-8)' }}>Notes</h4>
                <div style={{
                  padding: 'var(--space-12)',
                  background: 'var(--color-secondary)',
                  borderRadius: 'var(--radius-base)',
                  fontSize: 'var(--font-size-base)',
                }}>
                  {selectedSession.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-24)',
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Workout History</h2>
          <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
            {completedSessions.length} completed sessions
          </div>
        </div>
      </div>

      {completedSessions.length === 0 ? (
        <div className="card">
          <div className="card__body" style={{ textAlign: 'center', padding: 'var(--space-32)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-16)' }}>🏋️‍♀️</div>
            <h3 style={{ marginBottom: 'var(--space-8)' }}>No completed workouts yet</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Start your first workout to see your history here!
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 'var(--space-16)',
        }}>
          {completedSessions.map(renderSessionCard)}
        </div>
      )}

      {renderSessionDetails()}
    </div>
  );
};

export default WorkoutHistory;