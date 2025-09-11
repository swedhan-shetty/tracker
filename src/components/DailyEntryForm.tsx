import React, { useState, useEffect } from 'react';
import { DailyEntry, Habit, Goal, HabitCheck } from '../types';

interface DailyEntryFormProps {
  habits: Habit[];
  existingEntry?: DailyEntry;
  onSave: (entry: DailyEntry) => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({ 
  habits, 
  existingEntry, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Omit<DailyEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    energy: 5,
    productivity: 5,
    sleep: 8,
    exercise: false,
    notes: '',
    goals: [],
    habits: []
  });

  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    if (existingEntry) {
      setFormData({
        date: existingEntry.date,
        mood: existingEntry.mood,
        energy: existingEntry.energy,
        productivity: existingEntry.productivity,
        sleep: existingEntry.sleep,
        exercise: existingEntry.exercise,
        notes: existingEntry.notes,
        goals: existingEntry.goals,
        habits: existingEntry.habits
      });
    }
  }, [existingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry: DailyEntry = {
      ...formData,
      id: existingEntry?.id || `entry_${Date.now()}`
    };
    
    onSave(entry);
    
    if (!existingEntry) {
      // Reset form for new entries
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mood: 5,
        energy: 5,
        productivity: 5,
        sleep: 8,
        exercise: false,
        notes: '',
        goals: [],
        habits: []
      });
      setNewGoal('');
    }
  };

  const handleSliderChange = (field: 'mood' | 'energy' | 'productivity', value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal: Goal = {
        id: `goal_${Date.now()}`,
        title: newGoal.trim(),
        description: '',
        completed: false,
        priority: 'medium'
      };
      
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }));
      
      setNewGoal('');
    }
  };

  const toggleGoal = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    }));
  };

  const removeGoal = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  const toggleHabit = (habitId: string) => {
    setFormData(prev => {
      const existingHabitCheck = prev.habits.find(h => h.habitId === habitId);
      
      if (existingHabitCheck) {
        return {
          ...prev,
          habits: prev.habits.map(h =>
            h.habitId === habitId ? { ...h, completed: !h.completed } : h
          )
        };
      } else {
        return {
          ...prev,
          habits: [...prev.habits, { habitId, completed: true }]
        };
      }
    });
  };

  const isHabitCompleted = (habitId: string): boolean => {
    const habitCheck = formData.habits.find(h => h.habitId === habitId);
    return habitCheck?.completed || false;
  };

  return (
    <div className="daily-entry-form card">
      <div className="card__body">
        <h2>{existingEntry ? 'Edit Today\'s Entry' : 'New Daily Entry'}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)' }}>
          Track your daily metrics and goals
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>📅 Date</h3>
            <div className="form-group">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="form-control"
              />
            </div>
          </div>

        <div className="form-section">
          <h3>📊 Daily Metrics</h3>
          
          <div className="slider-group">
            <label>
              😊 Mood: {formData.mood}/10
              <input
                type="range"
                min="1"
                max="10"
                value={formData.mood}
                onChange={(e) => handleSliderChange('mood', parseInt(e.target.value))}
                className="slider"
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              ⚡ Energy: {formData.energy}/10
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => handleSliderChange('energy', parseInt(e.target.value))}
                className="slider"
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              🎯 Productivity: {formData.productivity}/10
              <input
                type="range"
                min="1"
                max="10"
                value={formData.productivity}
                onChange={(e) => handleSliderChange('productivity', parseInt(e.target.value))}
                className="slider"
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              😴 Sleep (hours):
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleep}
                onChange={(e) => setFormData(prev => ({ ...prev, sleep: parseFloat(e.target.value) }))}
                className="form-control"
              />
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.exercise}
                onChange={(e) => setFormData(prev => ({ ...prev, exercise: e.target.checked }))}
              />
              🏃‍♂️ Exercise completed
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>🎯 Today's Goals</h3>
          <div className="goal-input-group">
            <input
              type="text"
              placeholder="Add a goal for today..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              className="form-control goal-input"
            />
            <button type="button" onClick={addGoal} className="btn btn--primary btn--sm">
              Add Goal
            </button>
          </div>

          <div className="goals-list">
            {formData.goals.map(goal => (
              <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                />
                <span className="goal-title">{goal.title}</span>
                <button 
                  type="button" 
                  onClick={() => removeGoal(goal.id)}
                  className="remove-goal-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {habits.length > 0 && (
          <div className="form-section">
            <h3>🔄 Habits</h3>
            <div className="habits-list">
              {habits.map(habit => (
                <div key={habit.id} className="habit-item">
                  <input
                    type="checkbox"
                    checked={isHabitCompleted(habit.id)}
                    onChange={() => toggleHabit(habit.id)}
                  />
                  <span className="habit-name">{habit.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>📝 Notes</h3>
          <textarea
            placeholder="How was your day? Any thoughts or reflections..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="notes-textarea"
            rows={4}
          />
        </div>

          <button type="submit" className="btn btn--primary btn--full-width">
            {existingEntry ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyEntryForm;
