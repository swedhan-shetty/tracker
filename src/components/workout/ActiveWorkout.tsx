import React, { useState } from 'react';
import { useWorkoutTracker } from '../../hooks/useWorkoutTracker';

const ActiveWorkout: React.FC = () => {
  const { currentSession, addSet, completeWorkout } = useWorkoutTracker();
  const [exerciseId, setExerciseId] = useState('');
  const [reps, setReps] = useState<number>(10);
  const [weight, setWeight] = useState<number>(20);
  const [notes, setNotes] = useState('');

  if (!currentSession) {
    return <div className="card"><div className="card__body">No active workout</div></div>;
  }

  const handleAddSet = () => {
    if (!exerciseId) return;
    addSet(exerciseId, reps, weight, notes);
    setNotes('');
  };

  const exerciseOptions = Array.from(new Set(currentSession.sets.map(s => s.exerciseId)));

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-16)' }}>
        <div className="card__body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>{currentSession.templateName}</h2>
            <div style={{ color: 'var(--color-text-secondary)' }}>Started: {new Date(currentSession.startTime).toLocaleTimeString()}</div>
          </div>
          <button className="btn btn--primary" onClick={() => completeWorkout()}>✅ Finish Workout</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-16)' }}>
        <div className="card__body">
          <h3 style={{ marginBottom: 'var(--space-12)' }}>Add Set</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: 'var(--space-12)', alignItems: 'center' }}>
            <select className="form-control" value={exerciseId} onChange={e => setExerciseId(e.target.value)}>
              <option value="">Select exercise (type id)</option>
              {/* Allow user to type any exercise id or choose from existing in session */}
              {exerciseOptions.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <input className="form-control" type="number" value={reps} min={1} onChange={e => setReps(Number(e.target.value))} placeholder="Reps" />
            <input className="form-control" type="number" value={weight} min={0} step={0.5} onChange={e => setWeight(Number(e.target.value))} placeholder="Weight" />
            <input className="form-control" type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" />
            <button className="btn btn--secondary" onClick={handleAddSet}>Add</button>
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-8)' }}>
            Tip: Enter exercise id like "lat_pulldown", "leg_press", etc. We'll enhance with template-driven selection later.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__body">
          <h3 style={{ marginBottom: 'var(--space-12)' }}>Sets</h3>
          {currentSession.sets.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)' }}>No sets logged yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
              {currentSession.sets.map(set => (
                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: 'var(--space-12)', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-8)' }}>
                  <div style={{ fontWeight: 500 }}>{set.exerciseId}</div>
                  <div>{set.reps} reps</div>
                  <div>{set.weight} kg</div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{set.notes}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
