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

  const getStreakEmoji = (streakCount: number) => {
    if (streakCount === 0) return '';
    if (streakCount === 1) return '🌱';
    if (streakCount < 7) return '🔥';
    if (streakCount < 30) return '🚀';
    return '⭐';
  };

  return (
    <div className="simple-tasks-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="tasks-header" style={{ marginBottom: '30px' }}>
        <h2>Simple Tasks with Streaks</h2>
        <button 
          onClick={refreshStreaks}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Streaks
        </button>
      </div>

      {/* Add new task form */}
      <div className="add-task-form" style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h3>Add New Task</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <input
            type="text"
            placeholder="Task description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            style={{ 
              padding: '8px', 
              marginRight: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button 
            onClick={handleAddTask}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks list */}
      <div className="tasks-list">
        <h3>Your Tasks (Total: {tasks.length})</h3>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <>
            {/* Tasks sorted by streak */}
            <div style={{ marginBottom: '20px' }}>
              <h4>🏆 Top Streaks</h4>
              <div>
                {getTasksByStreak().slice(0, 3).map((task, index) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'inline-block',
                      margin: '5px 10px',
                      padding: '8px 12px',
                      backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    #{index + 1} {task.title}: {task.streakCount} days {getStreakEmoji(task.streakCount)}
                  </div>
                ))}
              </div>
            </div>

            {/* All tasks */}
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: task.completed ? '#e8f5e8' : '#ffffff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  style={{ 
                    marginRight: '15px',
                    transform: 'scale(1.2)',
                    cursor: 'pointer'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 5px 0', 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#666' : '#333'
                  }}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p style={{ 
                      margin: '0 0 5px 0', 
                      fontSize: '14px', 
                      color: '#666' 
                    }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    Priority: {task.priority} | 
                    Current Streak: <strong>{task.streakCount} days</strong> {getStreakEmoji(task.streakCount)} |
                    Live Streak: <strong>{getStreak(task.id)} days</strong>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Debug information */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f1f3f4', 
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Debug Info:</strong>
        <br />
        Tasks in state: {tasks.length}
        <br />
        Completed tasks: {tasks.filter(t => t.completed).length}
        <br />
        Tasks with streaks: {tasks.filter(t => t.streakCount > 0).length}
        <br />
        Best streak: {tasks.length > 0 ? Math.max(...tasks.map(t => t.streakCount)) : 0} days
      </div>
    </div>
  );
};

export default SimpleTasksComponent;
