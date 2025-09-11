import React from 'react';
import { BookStats as BookStatsType } from '../types/book';

interface BookStatsProps {
  stats: BookStatsType;
}

const BookStats: React.FC<BookStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const readingRate = stats.totalPages > 0 ? Math.round((stats.pagesRead / stats.totalPages) * 100) : 0;

  return (
    <div className="book-stats">
      {/* Overview Stats */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--space-24)' }}>
        <div className="card">
          <div className="card__body">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">📚 Total Books</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value" style={{ color: 'var(--color-success)' }}>
                  {stats.completed}
                </span>
                <span className="stat-label">✅ Completed</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value" style={{ color: 'var(--color-warning)' }}>
                  {stats.reading}
                </span>
                <span className="stat-label">📖 Currently Reading</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value" style={{ color: 'var(--color-info)' }}>
                  {stats.toRead}
                </span>
                <span className="stat-label">📚 To Read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Reading Progress */}
        <div className="card">
          <div className="card__body">
            <h3 style={{ marginBottom: 'var(--space-16)' }}>📊 Reading Progress</h3>
            
            <div style={{ marginBottom: 'var(--space-20)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 'var(--space-8)' 
              }}>
                <span style={{ fontSize: 'var(--font-size-sm)' }}>Completion Rate</span>
                <span style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 'var(--font-weight-medium)' 
                }}>
                  {completionRate}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-secondary)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${completionRate}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-success)',
                  transition: 'width var(--duration-normal) var(--ease-standard)'
                }} />
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.totalPages.toLocaleString()}</span>
                <span className="stat-label">Total Pages</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value" style={{ color: 'var(--color-success)' }}>
                  {stats.pagesRead.toLocaleString()}
                </span>
                <span className="stat-label">Pages Read</span>
              </div>
            </div>

            {stats.totalPages > 0 && (
              <div style={{ marginTop: 'var(--space-16)' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 'var(--space-8)' 
                }}>
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>Pages Read</span>
                  <span style={{ 
                    fontSize: 'var(--font-size-sm)', 
                    fontWeight: 'var(--font-weight-medium)' 
                  }}>
                    {readingRate}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--color-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${readingRate}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-primary)',
                    transition: 'width var(--duration-normal) var(--ease-standard)'
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Genre Breakdown */}
        <div className="card">
          <div className="card__body">
            <h3 style={{ marginBottom: 'var(--space-16)' }}>📂 Books by Genre</h3>
            
            {Object.keys(stats.genreBreakdown).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {Object.entries(stats.genreBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([genre, count], index) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    const colors = [
                      'var(--color-bg-1)', 'var(--color-bg-2)', 'var(--color-bg-3)', 
                      'var(--color-bg-4)', 'var(--color-bg-5)', 'var(--color-bg-6)',
                      'var(--color-bg-7)', 'var(--color-bg-8)'
                    ];
                    const backgroundColor = colors[index % colors.length];
                    
                    return (
                      <div 
                        key={genre}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'var(--space-12)',
                          backgroundColor,
                          borderRadius: 'var(--radius-base)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <div>
                          <div style={{ 
                            fontWeight: 'var(--font-weight-medium)',
                            fontSize: 'var(--font-size-sm)' 
                          }}>
                            {genre}
                          </div>
                          <div style={{ 
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-secondary)' 
                          }}>
                            {count} book{count !== 1 ? 's' : ''} • {percentage}%
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: 'var(--font-size-lg)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-text)' 
                        }}>
                          {count}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                fontStyle: 'italic',
                padding: 'var(--space-16)' 
              }}>
                No books added yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reading Insights */}
      {stats.total > 0 && (
        <div className="card" style={{ marginTop: 'var(--space-24)' }}>
          <div className="card__body">
            <h3 style={{ marginBottom: 'var(--space-16)' }}>💡 Reading Insights</h3>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div style={{ 
                padding: 'var(--space-16)', 
                backgroundColor: 'var(--color-bg-3)',
                borderRadius: 'var(--radius-base)',
                textAlign: 'center' 
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-3xl)', 
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text)' 
                }}>
                  {Math.round(stats.totalPages / (stats.total || 1))}
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  Average pages per book
                </div>
              </div>
              
              <div style={{ 
                padding: 'var(--space-16)', 
                backgroundColor: 'var(--color-bg-5)',
                borderRadius: 'var(--radius-base)',
                textAlign: 'center' 
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-3xl)', 
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text)' 
                }}>
                  {Object.keys(stats.genreBreakdown).length}
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  Different genres explored
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookStats;
