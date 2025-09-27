import React, { useState } from 'react';
import { SimpleTask } from '../types';
import { useSimpleTasks } from '../hooks/useSimpleTasks';
import { getStreak } from '../utils/streakUtils';

const SimpleTasksComponent: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    refreshStreaks,
    getTasksByStreak
  } = useSimpleTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        completed: false,
        priority: newTaskPriority
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
    }
  };

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa44';
      case 'low': return '#44ff44';
      default: return '#888888';
    }
  };

  const getStreakIcon = (streakCount: number) => {
    if (streakCount === 0) return 'radio_button_unchecked';
    if (streakCount === 1) return 'eco';
    if (streakCount < 7) return 'local_fire_department';
    if (streakCount < 30) return 'rocket_launch';
    return 'star';
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount === 0) return 'var(--color-text-disabled)';
    if (streakCount === 1) return 'var(--color-success)';
    if (streakCount < 7) return 'var(--color-warning)';
    if (streakCount < 30) return 'var(--color-info)';
    return 'var(--color-primary)';
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="section-title">
          <span className="material-icons">task_alt</span>
          Task Management
        </h2>
        <button 
          onClick={refreshStreaks}
          className="btn btn--secondary btn--sm"
        >
          <span className="material-icons icon-sm">refresh</span>
          Refresh Streaks
        </button>
      </div>

      {/* Add new task form */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">
            <span className="material-icons">add_task</span>
            Add New Task
          </h3>
        </div>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="form-input"
            style={{ flex: 2 }}
          />
          <input
            type="text"
            placeholder="Task description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="form-input"
            style={{ flex: 2 }}
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="form-select"
            style={{ flex: 1 }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button 
            onClick={handleAddTask}
            className="btn btn--primary"
            disabled={!newTaskTitle.trim()}
          >
            <span className="material-icons icon-sm">add</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks list */}
      <h3 className="subsection-title">
        <span className="material-icons">checklist</span>
        Your Tasks ({tasks.length})
      </h3>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons">assignment</span>
          <h3>No tasks yet</h3>
          <p>Add your first task above to get started with tracking your daily goals!</p>
          <button className="btn btn--primary" onClick={() => (document.querySelector('input[placeholder="Task title"]') as HTMLInputElement)?.focus()}>
            <span className="material-icons icon-sm">add</span>
            Create Your First Task
          </button>
        </div>
      ) : (
        <>
          {/* Tasks sorted by streak */}
          {getTasksByStreak().filter(task => task.streakCount > 0).length > 0 && (
            <div className="mb-6">
              <h4 className="subsection-title">
                <span className="material-icons">emoji_events</span>
                Top Streaks
              </h4>
              <div className="flex gap-3 flex-wrap mb-6">
                {getTasksByStreak().slice(0, 3).map((task, index) => (
                  <div
                    key={task.id}
                    className={`status-badge ${
                      index === 0 ? 'status-badge--success' :
                      index === 1 ? 'status-badge--info' :
                      'status-badge--warning'
                    }`}
                    style={{ padding: 'var(--spacing-2) var(--spacing-4)' }}
                  >
                    <span className="material-icons icon-sm" style={{ color: getStreakColor(task.streakCount) }}>
                      {getStreakIcon(task.streakCount)}
                    </span>
                    #{index + 1} {task.title}: {task.streakCount} days
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All tasks */}
          <div className="flex-col gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="form-checkbox"
                      style={{ 
                        transform: 'scale(1.3)',
                        cursor: 'pointer',
                        accentColor: 'var(--color-primary)'
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-semibold text-lg mb-2 ${
                      task.completed ? 'line-through text-muted' : 'text-primary'
                    }`}>
                      {task.title}
                    </div>
                    
                    {task.description && (
                      <p className="text-secondary mb-3" style={{ fontSize: 'var(--font-size-base)' }}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`status-badge ${
                        task.priority === 'high' ? 'status-badge--error' :
                        task.priority === 'medium' ? 'status-badge--warning' :
                        'status-badge--info'
                      }`}>
                        {task.priority} priority
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <span className="material-icons icon-sm" style={{ color: getStreakColor(task.streakCount) }}>
                          {getStreakIcon(task.streakCount)}
                        </span>
                        <span className="text-sm text-secondary font-medium">
                          {task.streakCount} day streak
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="material-icons icon-sm text-info">trending_up</span>
                        <span className="text-sm text-secondary font-medium">
                          Live: {getStreak(task.id)} days
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn btn--outline btn--sm"
                    style={{
                      color: 'var(--color-error)',
                      borderColor: 'var(--color-error)',
                      minWidth: 'auto'
                    }}
                    title="Delete task"
                  >
                    <span className="material-icons icon-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Debug information */}
      <div className="card" style={{ marginTop: 'var(--spacing-8)' }}>
        <div className="card-header">
          <h4 className="card-title">
            <span className="material-icons">bug_report</span>
            Debug Information
          </h4>
        </div>
        
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div className="metric-card">
            <div className="metric-value">{tasks.length}</div>
            <div className="metric-label">Total Tasks</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{tasks.filter(t => t.completed).length}</div>
            <div className="metric-label">Completed</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{tasks.filter(t => t.streakCount > 0).length}</div>
            <div className="metric-label">With Streaks</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{tasks.length > 0 ? Math.max(...tasks.map(t => t.streakCount)) : 0}</div>
            <div className="metric-label">Best Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTasksComponent;
