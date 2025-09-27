import React, { useMemo } from 'react';
import { useMacroLog } from '../../hooks/useMacroLog';
import { useDietTemplates } from '../../hooks/useDietTemplates';
import { NutritionInfo } from '../../types/nutrition';

interface MacroWeeklyViewProps {
  currentDate: string;
  className?: string;
  compact?: boolean;
}

interface DayData {
  date: string;
  dayName: string;
  shortName: string;
  totals: NutritionInfo;
  targets: NutritionInfo | null;
  isToday: boolean;
  isFuture: boolean;
}

const MacroWeeklyView: React.FC<MacroWeeklyViewProps> = ({ 
  currentDate, 
  className = '',
  compact = false 
}) => {
  const { sumDay } = useMacroLog();
  const { getCurrentTargets } = useDietTemplates();
  
  const weekData = useMemo((): DayData[] => {
    const currentDateObj = new Date(currentDate);
    const currentDayOfWeek = currentDateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start of week (Sunday)
    const startOfWeek = new Date(currentDateObj);
    startOfWeek.setDate(currentDateObj.getDate() - currentDayOfWeek);
    
    const today = new Date().toISOString().split('T')[0];
    
    const days: DayData[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        dayName: dayNames[i],
        shortName: shortNames[i],
        totals: sumDay(dateStr),
        targets: getCurrentTargets(dateStr),
        isToday: dateStr === today,
        isFuture: date > new Date(),
      });
    }
    
    return days;
  }, [currentDate, sumDay, getCurrentTargets]);

  const weeklyStats = useMemo(() => {
    const completedDays = weekData.filter(day => !day.isFuture && day.targets);
    
    if (completedDays.length === 0) {
      return null;
    }

    // Calculate averages for completed days
    const avgTotals = completedDays.reduce<NutritionInfo>((acc, day) => ({
      calories: (acc.calories || 0) + (day.totals.calories || 0),
      protein: (acc.protein || 0) + (day.totals.protein || 0),
      carbs: (acc.carbs || 0) + (day.totals.carbs || 0),
      fat: (acc.fat || 0) + (day.totals.fat || 0),
      fiber: (acc.fiber || 0) + (day.totals.fiber || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const avgTargets = completedDays.reduce<NutritionInfo>((acc, day) => ({
      calories: (acc.calories || 0) + (day.targets?.calories || 0),
      protein: (acc.protein || 0) + (day.targets?.protein || 0),
      carbs: (acc.carbs || 0) + (day.targets?.carbs || 0),
      fat: (acc.fat || 0) + (day.targets?.fat || 0),
      fiber: (acc.fiber || 0) + (day.targets?.fiber || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const count = completedDays.length;
    
    return {
      avgActual: {
        calories: Math.round((avgTotals.calories || 0) / count),
        protein: Math.round(((avgTotals.protein || 0) / count) * 10) / 10,
        carbs: Math.round(((avgTotals.carbs || 0) / count) * 10) / 10,
        fat: Math.round(((avgTotals.fat || 0) / count) * 10) / 10,
        fiber: Math.round(((avgTotals.fiber || 0) / count) * 10) / 10,
      },
      avgTargets: {
        calories: Math.round((avgTargets.calories || 0) / count),
        protein: Math.round(((avgTargets.protein || 0) / count) * 10) / 10,
        carbs: Math.round(((avgTargets.carbs || 0) / count) * 10) / 10,
        fat: Math.round(((avgTargets.fat || 0) / count) * 10) / 10,
        fiber: Math.round(((avgTargets.fiber || 0) / count) * 10) / 10,
      },
      adherenceRate: Math.round(
        completedDays.reduce((acc, day) => {
          if (!day.targets) return acc;
          const dayAdherence = [
            day.targets.calories > 0 ? Math.min(100, (day.totals.calories || 0) / day.targets.calories * 100) : 0,
            day.targets.protein > 0 ? Math.min(100, (day.totals.protein || 0) / day.targets.protein * 100) : 0,
            day.targets.carbs > 0 ? Math.min(100, (day.totals.carbs || 0) / day.targets.carbs * 100) : 0,
            day.targets.fat > 0 ? Math.min(100, (day.totals.fat || 0) / day.targets.fat * 100) : 0,
          ].reduce((sum, val) => sum + val, 0) / 4;
          return acc + dayAdherence;
        }, 0) / completedDays.length
      ),
      daysTracked: count,
    };
  }, [weekData]);

  const getProgressColor = (actual: number, target: number) => {
    if (target === 0) return '#666';
    const percentage = (actual / target) * 100;
    if (percentage >= 95) return '#27ae60';
    if (percentage >= 80) return '#f39c12';
    if (percentage >= 60) return '#e67e22';
    return '#e74c3c';
  };

  const getMacroBar = (actual: number, target: number, color: string) => {
    const percentage = target > 0 ? Math.min(100, (actual / target) * 100) : 0;
    return (
      <div style={{ 
        height: compact ? 4 : 6, 
        background: '#333', 
        borderRadius: 3, 
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: getProgressColor(actual, target),
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }} 
        />
        {percentage > 100 && (
          <div style={{
            position: 'absolute',
            right: 2,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#e74c3c',
            fontSize: 8,
            fontWeight: 'bold',
          }}>
            !
          </div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className={className}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Weekly Overview</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: 4,
          marginBottom: 12,
        }}>
          {weekData.map(day => (
            <div 
              key={day.date}
              style={{
                padding: 6,
                background: day.isToday ? '#2a2a2a' : '#1a1a1a',
                borderRadius: 4,
                border: day.isToday ? '1px solid #4caf50' : '1px solid #333',
                textAlign: 'center',
                opacity: day.isFuture ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 10, marginBottom: 4, fontWeight: 600 }}>
                {day.shortName}
              </div>
              <div style={{ fontSize: 8, opacity: 0.7, marginBottom: 4 }}>
                {new Date(day.date).getDate()}
              </div>
              
              {day.targets && !day.isFuture ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {getMacroBar(day.totals.calories || 0, day.targets.calories, '#e74c3c')}
                  {getMacroBar(day.totals.protein || 0, day.targets.protein, '#3498db')}
                  {getMacroBar(day.totals.carbs || 0, day.targets.carbs, '#f39c12')}
                  {getMacroBar(day.totals.fat || 0, day.targets.fat, '#9b59b6')}
                </div>
              ) : (
                <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, opacity: 0.5 }}>
                    {day.isFuture ? 'Future' : 'No data'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {weeklyStats && (
          <div style={{
            padding: 8,
            background: '#1a1a1a',
            borderRadius: 6,
            border: '1px solid #333',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Week Summary ({weeklyStats.daysTracked} days)
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>
              Adherence: {weeklyStats.adherenceRate}% • 
              Avg Cal: {weeklyStats.avgActual.calories}/{weeklyStats.avgTargets.calories}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Weekly Macro Overview</h2>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Week of {weekData[0]?.date ? new Date(weekData[0].date).toLocaleDateString() : ''}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: 12,
        marginBottom: 20,
      }}>
        {weekData.map(day => (
          <div 
            key={day.date}
            style={{
              padding: 12,
              background: day.isToday ? '#2a2a2a' : '#1a1a1a',
              borderRadius: 8,
              border: day.isToday ? '2px solid #4caf50' : '1px solid #333',
              opacity: day.isFuture ? 0.6 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                {day.shortName}
              </div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              {day.isToday && <div style={{ fontSize: 8, color: '#4caf50', fontWeight: 600 }}>TODAY</div>}
            </div>
            
            {day.targets && !day.isFuture ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>Cal</span>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {day.totals.calories || 0}/{day.targets.calories}
                  </span>
                </div>
                {getMacroBar(day.totals.calories || 0, day.targets.calories, '#e74c3c')}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>P</span>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {day.totals.protein || 0}/{day.targets.protein}g
                  </span>
                </div>
                {getMacroBar(day.totals.protein || 0, day.targets.protein, '#3498db')}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>C</span>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {day.totals.carbs || 0}/{day.targets.carbs}g
                  </span>
                </div>
                {getMacroBar(day.totals.carbs || 0, day.targets.carbs, '#f39c12')}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>F</span>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {day.totals.fat || 0}/{day.targets.fat}g
                  </span>
                </div>
                {getMacroBar(day.totals.fat || 0, day.targets.fat, '#9b59b6')}
                
                {day.targets.fiber && day.targets.fiber > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, opacity: 0.8 }}>Fiber</span>
                      <span style={{ fontSize: 10, fontWeight: 600 }}>
                        {day.totals.fiber || 0}/{day.targets.fiber}g
                      </span>
                    </div>
                    {getMacroBar(day.totals.fiber || 0, day.targets.fiber, '#27ae60')}
                  </>
                )}
              </div>
            ) : (
              <div style={{ 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 4,
              }}>
                <span style={{ fontSize: 12, opacity: 0.5 }}>
                  {day.isFuture ? '🔮' : '📝'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.5, textAlign: 'center' }}>
                  {day.isFuture ? 'Future day' : 'No tracking data'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {weeklyStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          padding: 16,
          background: '#1a1a1a',
          borderRadius: 8,
          border: '1px solid #333',
        }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              📊 Weekly Summary
            </h4>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              <div>Days tracked: {weeklyStats.daysTracked}/7</div>
              <div>Overall adherence: {weeklyStats.adherenceRate}%</div>
            </div>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              🎯 Average Targets vs Actual
            </h4>
            <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Calories:</span>
                <span style={{ color: getProgressColor(weeklyStats.avgActual.calories, weeklyStats.avgTargets.calories) }}>
                  {weeklyStats.avgActual.calories}/{weeklyStats.avgTargets.calories}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Protein:</span>
                <span style={{ color: getProgressColor(weeklyStats.avgActual.protein, weeklyStats.avgTargets.protein) }}>
                  {weeklyStats.avgActual.protein}g/{weeklyStats.avgTargets.protein}g
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Carbs:</span>
                <span style={{ color: getProgressColor(weeklyStats.avgActual.carbs, weeklyStats.avgTargets.carbs) }}>
                  {weeklyStats.avgActual.carbs}g/{weeklyStats.avgTargets.carbs}g
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Fat:</span>
                <span style={{ color: getProgressColor(weeklyStats.avgActual.fat, weeklyStats.avgTargets.fat) }}>
                  {weeklyStats.avgActual.fat}g/{weeklyStats.avgTargets.fat}g
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              📈 Progress Indicators
            </h4>
            <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ 
                padding: '4px 8px',
                borderRadius: 4,
                background: weeklyStats.adherenceRate >= 90 ? '#27ae60' : 
                          weeklyStats.adherenceRate >= 75 ? '#f39c12' : '#e74c3c',
                textAlign: 'center',
                fontWeight: 600,
              }}>
                {weeklyStats.adherenceRate >= 90 ? '🌟 Excellent!' :
                 weeklyStats.adherenceRate >= 75 ? '⚡ Good job!' : '🔥 Keep pushing!'}
              </div>
              <div style={{ fontSize: 10, opacity: 0.7, textAlign: 'center' }}>
                {weeklyStats.adherenceRate >= 90 ? 'You\'re crushing your macro goals!' :
                 weeklyStats.adherenceRate >= 75 ? 'Solid progress this week.' : 
                 'Room for improvement - you got this!'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#1a1a1a', 
        borderRadius: 6, 
        border: '1px solid #333',
        fontSize: 11,
        opacity: 0.8,
      }}>
        <strong>Legend:</strong> 
        <span style={{ color: '#27ae60', marginLeft: 8 }}>● 95%+</span>
        <span style={{ color: '#f39c12', marginLeft: 8 }}>● 80-94%</span>
        <span style={{ color: '#e67e22', marginLeft: 8 }}>● 60-79%</span>
        <span style={{ color: '#e74c3c', marginLeft: 8 }}>● &lt;60%</span>
        <span style={{ marginLeft: 12 }}>Progress bars show % of daily target achieved</span>
      </div>
    </div>
  );
};

export default MacroWeeklyView;
