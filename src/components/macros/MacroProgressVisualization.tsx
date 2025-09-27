import React from 'react';
import { NutritionInfo } from '../../types/nutrition';

interface MacroProgressVisualizationProps {
  current: NutritionInfo;
  targets: NutritionInfo;
  className?: string;
  showDetailed?: boolean;
  compact?: boolean;
}

interface MacroItemProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  compact?: boolean;
  warningThreshold?: number; // Percentage threshold for warning color
  successThreshold?: number; // Percentage threshold for success color
}

const MacroItem: React.FC<MacroItemProps> = ({
  label,
  current,
  target,
  unit,
  color,
  compact = false,
  warningThreshold = 80,
  successThreshold = 95,
}) => {
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const remaining = Math.max(0, target - current);
  const isOver = current > target;
  const isClose = percentage >= successThreshold;
  const isModerate = percentage >= warningThreshold;

  // Dynamic color based on progress
  const getProgressColor = () => {
    if (isOver) return '#e74c3c'; // Red for over target
    if (isClose) return '#27ae60'; // Green for close to target
    if (isModerate) return '#f39c12'; // Orange for moderate progress
    return '#3498db'; // Blue for low progress
  };

  const getStatusIcon = () => {
    if (isOver) return '⚠️';
    if (isClose) return '✅';
    if (isModerate) return '⚡';
    return '';
  };

  if (compact) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        padding: '8px 12px',
        background: '#1a1a1a',
        borderRadius: 6,
        border: `2px solid ${isOver ? '#e74c3c' : isClose ? '#27ae60' : '#333'}`,
      }}>
        <div style={{ minWidth: 60, fontSize: 12, opacity: 0.8 }}>
          {label}
        </div>
        <div style={{ flex: 1, height: 8, background: '#333', borderRadius: 4, overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${Math.min(100, percentage)}%`, 
              height: '100%', 
              background: getProgressColor(),
              borderRadius: 4,
              transition: 'width 0.3s ease',
            }} 
          />
        </div>
        <div style={{ 
          fontSize: 12, 
          fontWeight: 600,
          color: getProgressColor(),
          minWidth: 50,
          textAlign: 'right',
        }}>
          {current}/{target}{unit}
        </div>
        {getStatusIcon() && (
          <span style={{ fontSize: 12 }}>{getStatusIcon()}</span>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: 16,
      background: '#1a1a1a',
      borderRadius: 8,
      border: `2px solid ${isOver ? '#e74c3c' : isClose ? '#27ae60' : '#333'}`,
      transition: 'border-color 0.3s ease',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {label}
          {getStatusIcon() && (
            <span style={{ fontSize: 16 }}>{getStatusIcon()}</span>
          )}
        </div>
        <div style={{ 
          fontSize: 18, 
          fontWeight: 700,
          color: getProgressColor(),
        }}>
          {current}<span style={{ fontSize: 12, opacity: 0.7 }}>/{target}{unit}</span>
        </div>
      </div>
      
      <div style={{ 
        height: 12, 
        background: '#333', 
        borderRadius: 6, 
        overflow: 'hidden',
        marginBottom: 8,
      }}>
        <div 
          style={{ 
            width: `${Math.min(100, percentage)}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, ${getProgressColor()}, ${getProgressColor()}dd)`,
            borderRadius: 6,
            transition: 'width 0.3s ease',
          }} 
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 12, 
        opacity: 0.8,
      }}>
        <span style={{ color: getProgressColor() }}>
          {percentage}% complete
        </span>
        <span style={{ color: isOver ? '#e74c3c' : '#4caf50' }}>
          {isOver ? `${(current - target).toFixed(1)}${unit} over` : `${remaining.toFixed(1)}${unit} remaining`}
        </span>
      </div>
    </div>
  );
};

const MacroProgressVisualization: React.FC<MacroProgressVisualizationProps> = ({ 
  current, 
  targets, 
  className = '',
  showDetailed = false,
  compact = false,
}) => {
  const macroItems = [
    {
      label: 'Calories',
      key: 'calories' as keyof NutritionInfo,
      unit: '',
      color: '#e74c3c',
    },
    {
      label: 'Protein',
      key: 'protein' as keyof NutritionInfo,
      unit: 'g',
      color: '#3498db',
    },
    {
      label: 'Carbs',
      key: 'carbs' as keyof NutritionInfo,
      unit: 'g',
      color: '#f39c12',
    },
    {
      label: 'Fat',
      key: 'fat' as keyof NutritionInfo,
      unit: 'g',
      color: '#9b59b6',
    },
    {
      label: 'Fiber',
      key: 'fiber' as keyof NutritionInfo,
      unit: 'g',
      color: '#27ae60',
    },
  ];

  const validMacros = macroItems.filter(item => 
    targets[item.key] !== undefined && (targets[item.key] as number) > 0
  );

  // Calculate overall progress
  const overallProgress = validMacros.reduce((acc, item) => {
    const currentVal = (current[item.key] as number) || 0;
    const targetVal = (targets[item.key] as number) || 0;
    return acc + (targetVal > 0 ? Math.min(100, (currentVal / targetVal) * 100) : 0);
  }, 0) / validMacros.length;

  if (compact) {
    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Overall Progress Summary */}
        <div style={{
          padding: 12,
          background: '#1a1a1a',
          borderRadius: 8,
          border: `2px solid ${overallProgress >= 95 ? '#27ae60' : overallProgress >= 80 ? '#f39c12' : '#333'}`,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Overall Progress</span>
            <span style={{ 
              fontSize: 16, 
              fontWeight: 700,
              color: overallProgress >= 95 ? '#27ae60' : overallProgress >= 80 ? '#f39c12' : '#3498db'
            }}>
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div style={{ 
            height: 8, 
            background: '#333', 
            borderRadius: 4, 
            overflow: 'hidden' 
          }}>
            <div 
              style={{ 
                width: `${overallProgress}%`, 
                height: '100%', 
                background: overallProgress >= 95 ? '#27ae60' : overallProgress >= 80 ? '#f39c12' : '#3498db',
                borderRadius: 4,
                transition: 'width 0.3s ease',
              }} 
            />
          </div>
        </div>
        
        {/* Individual Macros */}
        {validMacros.map(item => (
          <MacroItem
            key={item.key}
            label={item.label}
            current={(current[item.key] as number) || 0}
            target={(targets[item.key] as number) || 0}
            unit={item.unit}
            color={item.color}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'grid', gap: 16 }}>
      {showDetailed && (
        <div style={{
          padding: 16,
          background: '#1a1a1a',
          borderRadius: 8,
          border: `2px solid ${overallProgress >= 95 ? '#27ae60' : overallProgress >= 80 ? '#f39c12' : '#333'}`,
        }}>
          <h3 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            Daily Progress Overview
            {overallProgress >= 95 && <span>🎯</span>}
            {overallProgress >= 80 && overallProgress < 95 && <span>⚡</span>}
          </h3>
          <div style={{ 
            height: 16, 
            background: '#333', 
            borderRadius: 8, 
            overflow: 'hidden',
            marginBottom: 8,
          }}>
            <div 
              style={{ 
                width: `${overallProgress}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, ${
                  overallProgress >= 95 ? '#27ae60' : overallProgress >= 80 ? '#f39c12' : '#3498db'
                }, ${
                  overallProgress >= 95 ? '#2ecc71' : overallProgress >= 80 ? '#e67e22' : '#5dade2'
                })`,
                borderRadius: 8,
                transition: 'width 0.5s ease',
              }} 
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: 14, 
            fontWeight: 600,
          }}>
            <span>Overall: {Math.round(overallProgress)}%</span>
            <span style={{ 
              color: overallProgress >= 95 ? '#27ae60' : overallProgress >= 80 ? '#f39c12' : '#3498db'
            }}>
              {overallProgress >= 95 ? 'Excellent!' : overallProgress >= 80 ? 'Good progress' : 'Keep going!'}
            </span>
          </div>
        </div>
      )}
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: validMacros.length >= 4 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16 
      }}>
        {validMacros.map(item => (
          <MacroItem
            key={item.key}
            label={item.label}
            current={(current[item.key] as number) || 0}
            target={(targets[item.key] as number) || 0}
            unit={item.unit}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default MacroProgressVisualization;
