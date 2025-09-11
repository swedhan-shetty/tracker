import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  getTaskCompletionChartData,
  getWeeklyTaskCompletion,
  getWeeklyTasksByType,
  getCompletionStatistics,
  getDailyCompletionTrend,
  TaskCompletionData,
  WeeklyTaskData,
  TaskTypeData
} from '../utils/analyticsUtils';
import {
  populateLocalStorageWithSampleData,
  clearAllLocalStorageData,
  checkLocalStorageData
} from '../utils/sampleDataGenerator';
import {
  exportAsJSON,
  exportAsCSV,
  exportBothFormats,
  getExportSummary
} from '../utils/exportUtils';
import {
  generateWeeklySummary,
  getSummaryStats,
  SummaryResponse
} from '../utils/openAIUtils';
import SummaryModal from './SummaryModal';

const Analytics: React.FC = () => {
  const [taskCompletionData, setTaskCompletionData] = useState<WeeklyTaskData[]>([]);
  const [weeklyCompletionData, setWeeklyCompletionData] = useState<TaskCompletionData[]>([]);
  const [taskTypeData, setTaskTypeData] = useState<TaskTypeData[]>([]);
  const [completionTrendData, setCompletionTrendData] = useState<{ date: string; completionRate: number; displayDate: string }[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'tasks' | 'daily' | 'types' | 'trend'>('tasks');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  
  // AI Summary state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<SummaryResponse | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryDateRange, setSummaryDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load all analytics data
      const taskData = getTaskCompletionChartData();
      const weeklyData = getWeeklyTaskCompletion();
      const typeData = getWeeklyTasksByType();
      const trendData = getDailyCompletionTrend();
      const stats = getCompletionStatistics();

      setTaskCompletionData(taskData);
      setWeeklyCompletionData(weeklyData);
      setTaskTypeData(typeData);
      setCompletionTrendData(trendData);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' | 'both') => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      switch (format) {
        case 'json':
          await exportAsJSON();
          break;
        case 'csv':
          await exportAsCSV();
          break;
        case 'both':
          await exportBothFormats();
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setExportError(errorMessage);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateSummary = async (days: number = 7) => {
    setIsGeneratingSummary(true);
    setSummaryError(null);
    setCurrentSummary(null);
    
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days - 1));
      
      setSummaryDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });
      
      // Open modal with loading state
      setIsSummaryModalOpen(true);
      
      // Generate summary (using mock for now)
      const summary = await generateWeeklySummary(days, true);
      setCurrentSummary(summary);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      setSummaryError(errorMessage);
      console.error('Summary generation error:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCloseSummaryModal = () => {
    setIsSummaryModalOpen(false);
    setSummaryError(null);
    setCurrentSummary(null);
    setSummaryDateRange(null);
  };

  const formatTooltipValue = (value: any, name: string) => {
    if (name === 'completionRate') {
      return [`${value}%`, 'Completion Rate'];
    }
    return [value, name];
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Analytics Dashboard</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Track your task completion patterns and productivity insights over the past week
        </p>

        {/* Statistics Cards */}
        {statistics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>
                {statistics.totalCompleted}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Tasks Completed</div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                out of {statistics.totalTasks} total
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
                {statistics.avgCompletionRate}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Avg Completion Rate</div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                past 7 days
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '5px' }}>
                {statistics.avgTasksPerDay}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Avg Tasks/Day</div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {statistics.activeDays} active days
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107', marginBottom: '5px' }}>
                {statistics.bestDay ? statistics.bestDay.completionRate.toFixed(0) : 0}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Best Day</div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {statistics.bestDay ? statistics.bestDay.displayDate : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Chart Selection Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveChart('tasks')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeChart === 'tasks' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Task Completions
          </button>
          <button
            onClick={() => setActiveChart('daily')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeChart === 'daily' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Daily Overview
          </button>
          <button
            onClick={() => setActiveChart('trend')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeChart === 'trend' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Completion Trend
          </button>
          <button
            onClick={() => setActiveChart('types')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeChart === 'types' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Task Types
          </button>
        </div>

        {/* AI Summary Section */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f0f8e8',
          borderRadius: '8px',
          border: '1px solid #c3e6cb',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ marginRight: '10px' }}>
            <strong>🤖 AI Analysis:</strong>
          </div>
          <button
            onClick={() => handleGenerateSummary(7)}
            disabled={isGeneratingSummary}
            style={{
              padding: '8px 16px',
              backgroundColor: isGeneratingSummary ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isGeneratingSummary ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isGeneratingSummary ? (
              <>
                <span>🧠</span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate Summary</span>
              </>
            )}
          </button>
          <div style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
            {(() => {
              const stats = getSummaryStats();
              if (stats.totalSaved > 0) {
                return `${stats.totalSaved} saved summaries`;
              }
              return 'Get AI insights on your weekly progress';
            })()} 
          </div>
        </div>

        {/* Export Section */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#e8f4f8',
          borderRadius: '8px',
          border: '1px solid #b8daff',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ marginRight: '10px' }}>
            <strong>📥 Export Data:</strong>
          </div>
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            style={{
              padding: '8px 16px',
              backgroundColor: isExporting ? '#6c757d' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isExporting ? 'Exporting...' : 'Export JSON'}
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            style={{
              padding: '8px 16px',
              backgroundColor: isExporting ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExport('both')}
            disabled={isExporting}
            style={{
              padding: '8px 16px',
              backgroundColor: isExporting ? '#6c757d' : '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isExporting ? 'Exporting...' : 'Export Both'}
          </button>
          <div style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
            {(() => {
              const summary = getExportSummary();
              if (!summary.hasData) {
                return 'No data to export';
              }
              return `${summary.entriesCount} entries, ${summary.tasksCount} tasks, ${summary.supplementsCount} supplements`;
            })()} 
          </div>
          {exportError && (
            <div style={{
              fontSize: '12px',
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              padding: '5px 10px',
              borderRadius: '3px',
              border: '1px solid #f5c6cb',
              marginLeft: '10px'
            }}>
              Error: {exportError}
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: '400px'
      }}>
        {/* Task Completions Bar Chart */}
        {activeChart === 'tasks' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Task Completions (Past 7 Days)
            </h3>
            {taskCompletionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={taskCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="taskName" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Completed']}
                    labelStyle={{ color: '#333' }}
                  />
                  <Bar 
                    dataKey="completed" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                color: '#666' 
              }}>
                <h4>No task data available</h4>
                <p>Complete some tasks to see your progress here!</p>
              </div>
            )}
          </div>
        )}

        {/* Daily Overview Stacked Bar Chart */}
        {activeChart === 'daily' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Daily Task Overview (Past 7 Days)
            </h3>
            {weeklyCompletionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelStyle={{ color: '#333' }}
                  />
                  <Legend />
                  <Bar dataKey="goalTasks" stackId="a" fill="#8884d8" name="Goals" />
                  <Bar dataKey="supplementTasks" stackId="a" fill="#82ca9d" name="Supplements" />
                  <Bar dataKey="simpleTasks" stackId="a" fill="#ffc658" name="Simple Tasks" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                color: '#666' 
              }}>
                <h4>No daily data available</h4>
                <p>Start creating daily entries to see your patterns!</p>
              </div>
            )}
          </div>
        )}

        {/* Completion Trend Line Chart */}
        {activeChart === 'trend' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Completion Rate Trend (Past 7 Days)
            </h3>
            {completionTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={completionTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Completion Rate']}
                    labelStyle={{ color: '#333' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                color: '#666' 
              }}>
                <h4>No trend data available</h4>
                <p>Complete tasks over multiple days to see your trend!</p>
              </div>
            )}
          </div>
        )}

        {/* Task Types Pie Chart */}
        {activeChart === 'types' && (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Task Types Distribution (Past 7 Days)
            </h3>
            {taskTypeData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={taskTypeData.filter(d => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {taskTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Completed']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                color: '#666' 
              }}>
                <h4>No task type data available</h4>
                <p>Complete different types of tasks to see the distribution!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* AI Summary Modal */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={handleCloseSummaryModal}
        summary={currentSummary}
        dateRange={summaryDateRange}
        isLoading={isGeneratingSummary}
        error={summaryError}
      />

      {/* Data Summary */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ marginBottom: '15px' }}>Data Summary</h4>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>
          <p><strong>Analytics Data:</strong> Last 7 days of daily entries from localStorage</p>
          <p><strong>Export Data:</strong> All historical data including daily entries, tasks, supplements, and notes</p>
          <p><strong>Formats Available:</strong> JSON (structured data) and CSV (spreadsheet-compatible)</p>
          <p><strong>Data Included:</strong> Daily metrics, task completion history, supplement tracking, and personal notes</p>
          {taskCompletionData.length === 0 && weeklyCompletionData.every(d => d.totalTasks === 0) && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              color: '#856404'
            }}>
              <strong>Note:</strong> No task data found. Create some daily entries with goals to see analytics data.
            </div>
          )}
        </div>
      </div>

      {/* Data Management Section */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        border: '1px solid #ced4da'
      }}>
        <h4 style={{ marginBottom: '15px' }}>Data Management (Development)</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => {
              populateLocalStorageWithSampleData(7);
              loadAnalyticsData();
            }}
            style={{
              padding: '8px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Generate Sample Data
          </button>
          <button
            onClick={() => {
              clearAllLocalStorageData();
              loadAnalyticsData();
            }}
            style={{
              padding: '8px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear All Data
          </button>
          <button
            onClick={loadAnalyticsData}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Refresh Data
          </button>
          <span style={{ fontSize: '12px', color: '#666' }}>
            Current data: {(() => {
              const data = checkLocalStorageData();
              return `${data.entryCount} entries, ${data.taskCount} tasks, ${data.supplementCount} supplements`;
            })()} 
          </span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
