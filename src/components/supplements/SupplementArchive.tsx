import React, { useState, useMemo } from 'react';
import { useSupplementArchive } from '../../hooks/useSupplementArchive';
import { Supplement, SupplementCategory } from '../../types/supplements';
import SupplementModal from './SupplementModal';
import AnalyticsCharts from './AnalyticsCharts';

type ViewMode = 'library' | 'stack' | 'analytics' | 'recommendations';

const categoryColors = {
  'Essential Lifelong': '#4ade80',
  'Goal-Specific': '#60a5fa',
  'Uncertain/Trial': '#fbbf24',
  'Wishlist': '#a78bfa',
};

const SupplementArchive: React.FC = () => {
  const {
    supplements,
    currentStack,
    goals,
    budget,
    monthlySpending,
    recommendations,
    supplementStats,
    currentStackByCategory,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    toggleCurrentStack,
    removeFromStack,
    searchSupplements,
    exportLibraryCSV,
    exportStackCSV,
    exportAnalyticsCSV,
  } = useSupplementArchive();

  const [currentView, setCurrentView] = useState<ViewMode>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<Supplement | null>(null);

  const filteredSupplements = useMemo(() => {
    return searchSupplements(searchQuery);
  }, [searchQuery, searchSupplements]);

  const filteredByCategory = useMemo(() => {
    return filteredSupplements.reduce((acc, supplement) => {
      if (!acc[supplement.category]) {
        acc[supplement.category] = [];
      }
      acc[supplement.category].push(supplement);
      return acc;
    }, {} as Record<SupplementCategory, Supplement[]>);
  }, [filteredSupplements]);

  const handleAddSupplement = () => {
    setEditingSupplement(null);
    setShowModal(true);
  };

  const handleEditSupplement = (supplement: Supplement) => {
    setEditingSupplement(supplement);
    setShowModal(true);
  };

  const handleDeleteSupplement = (id: string) => {
    const supplement = supplements.find(s => s.id === id);
    if (supplement && window.confirm(`Are you sure you want to delete "${supplement.name}"?`)) {
      deleteSupplement(id);
    }
  };

  const handleSaveSupplement = (data: any) => {
    if (editingSupplement) {
      updateSupplement(editingSupplement.id, data);
    } else {
      addSupplement(data);
    }
    setShowModal(false);
    setEditingSupplement(null);
  };

  const renderNavigation = () => (
    <nav style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
      {[
        { id: 'library', label: 'Library' },
        { id: 'stack', label: 'Current Stack' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'recommendations', label: 'Recommendations' },
      ].map(nav => (
        <button
          key={nav.id}
          onClick={() => setCurrentView(nav.id as ViewMode)}
          className={`btn ${currentView === nav.id ? 'btn--primary' : 'btn--outline'} btn--sm`}
        >
          {nav.label}
        </button>
      ))}
    </nav>
  );

  const renderSupplementCard = (supplement: Supplement) => (
    <div
      key={supplement.id}
      style={{
        background: '#2d2d2d',
        border: '1px solid #333',
        borderRadius: 8,
        padding: 16,
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.borderColor = '#4caf50';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#333';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'white', flexGrow: 1 }}>
          {supplement.name}
        </h4>
        {supplement.inCurrentStack && (
          <span style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 20,
            background: '#4caf50',
            color: '#1a1a1a',
            fontWeight: 500,
          }}>
            In Stack
          </span>
        )}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          <button
            onClick={() => handleEditSupplement(supplement)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              fontSize: 14,
            }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDeleteSupplement(supplement.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              fontSize: 14,
            }}
            title="Delete"
          >
            🗑️
          </button>
          <button
            onClick={() => toggleCurrentStack(supplement.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              fontSize: 14,
            }}
            title={supplement.inCurrentStack ? 'Remove from Stack' : 'Add to Stack'}
          >
            {supplement.inCurrentStack ? '➖' : '➕'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {supplement.dosage && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dosage
            </div>
            <div style={{ fontSize: 13, color: 'white', lineHeight: 1.4 }}>
              {supplement.dosage}
            </div>
          </div>
        )}
        
        {supplement.timing && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Timing
            </div>
            <div style={{ fontSize: 13, color: 'white', lineHeight: 1.4 }}>
              {supplement.timing}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cost per Month
          </div>
          <div style={{ fontSize: 13, color: '#4caf50', fontWeight: 600 }}>
            {supplement.costPerMonth ? `₹${supplement.costPerMonth}` : supplement.costRange || 'Cost TBD'}
          </div>
        </div>

        {supplement.purpose && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Purpose
            </div>
            <div style={{ fontSize: 13, color: 'white', lineHeight: 1.4 }}>
              {supplement.purpose}
            </div>
          </div>
        )}

        {supplement.roi && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ROI
            </div>
            <div style={{ fontSize: 13, color: 'white', lineHeight: 1.4 }}>
              {supplement.roi}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStackCard = (supplement: Supplement) => (
    <div
      key={supplement.id}
      style={{
        background: '#2d2d2d',
        border: '1px solid #333',
        borderLeft: '4px solid #4caf50',
        borderRadius: 8,
        padding: 20,
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'white' }}>
          {supplement.name}
        </h4>
        <span style={{
          background: 'rgba(76, 175, 80, 0.2)',
          color: '#4ade80',
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 500,
        }}>
          {supplement.currentDosage || 'Not specified'}
        </span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 12, 
        marginBottom: 16 
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recommended
          </div>
          <div style={{ fontSize: 13, color: 'white' }}>
            {supplement.dosage || 'N/A'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monthly Cost
          </div>
          <div style={{ fontSize: 13, color: 'white' }}>
            {supplement.costPerMonth ? `₹${supplement.costPerMonth}` : 'Cost TBD'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Timing
          </div>
          <div style={{ fontSize: 13, color: 'white' }}>
            {supplement.timing || 'N/A'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Purpose
          </div>
          <div style={{ fontSize: 13, color: 'white' }}>
            {supplement.purpose || 'N/A'}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid #333',
        paddingTop: 12 
      }}>
        <button
          onClick={() => removeFromStack(supplement.id)}
          style={{
            color: '#ff5459',
            fontSize: 13,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 84, 89, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Remove from Stack
        </button>
        <button
          onClick={() => handleEditSupplement(supplement)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );

  const renderLibraryView = () => (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <h2 style={{ margin: 0, fontSize: 24, color: 'white' }}>Supplement Library</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #333',
                background: '#333',
                color: 'white',
              }}
            />
          </div>
          <button
            onClick={handleAddSupplement}
            style={{
              padding: '8px 16px',
              background: '#4caf50',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Add Supplement
          </button>
          <button
            onClick={exportLibraryCSV}
            style={{
              padding: '8px 16px',
              background: '#666',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {(['Essential Lifelong', 'Goal-Specific', 'Uncertain/Trial', 'Wishlist'] as SupplementCategory[]).map(category => (
          <div key={category} style={{
            background: '#2d2d2d',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #333',
          }}>
            <h3 style={{
              fontSize: 18,
              fontWeight: 600,
              margin: '0 0 16px 0',
              padding: '8px 16px',
              borderRadius: 8,
              display: 'inline-block',
              background: `rgba(${category === 'Essential Lifelong' ? '76, 175, 80' : 
                                category === 'Goal-Specific' ? '96, 165, 250' :
                                category === 'Uncertain/Trial' ? '251, 191, 36' : '167, 139, 250'}, 0.15)`,
              color: categoryColors[category],
            }}>
              {category}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 16,
              minHeight: 60,
            }}>
              {filteredByCategory[category]?.map(renderSupplementCard) || (
                <div style={{ 
                  color: '#999', 
                  fontStyle: 'italic', 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: 24 
                }}>
                  No supplements in this category
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStackView = () => (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <h2 style={{ margin: 0, fontSize: 24, color: 'white' }}>Current Stack</h2>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>Total Supplements:</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#4caf50' }}>{supplementStats.totalSupplements}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>Monthly Cost:</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#4caf50' }}>₹{supplementStats.monthlyCost}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>Budget Remaining:</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#4caf50' }}>₹{supplementStats.budgetRemaining}</div>
          </div>
          <button
            onClick={exportStackCSV}
            style={{
              padding: '8px 16px',
              background: '#666',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Export Stack CSV
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: 16,
      }}>
        {currentStack.length === 0 ? (
          <div style={{
            color: '#999',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: 24,
            gridColumn: '1 / -1',
            background: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 12,
          }}>
            No supplements in your current stack. Add some from the library!
          </div>
        ) : (
          currentStack.map(renderStackCard)
        )}
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 24,
      }}>
        <h2 style={{ margin: 0, fontSize: 24, color: 'white' }}>Analytics Dashboard</h2>
        <button
          onClick={exportAnalyticsCSV}
          style={{
            padding: '8px 16px',
            background: '#666',
            border: 'none',
            borderRadius: 4,
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Export Analytics CSV
        </button>
      </div>
      
      <AnalyticsCharts 
        monthlySpending={monthlySpending}
        currentStackByCategory={currentStackByCategory}
        budget={budget}
        supplementStats={supplementStats}
      />
    </div>
  );

  const renderRecommendationsView = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, color: 'white' }}>Goal-Based Recommendations</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          {goals.map(goal => (
            <div
              key={goal.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: '8px 16px',
                background: goal.active ? 'rgba(76, 175, 80, 0.1)' : '#2d2d2d',
                border: goal.active ? '1px solid #4caf50' : '1px solid #333',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{goal.name}</div>
              <div style={{ fontSize: 11, color: '#999' }}>{goal.progress}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: 16,
      }}>
        {recommendations.map((rec, index) => (
          <div
            key={index}
            style={{
              background: '#2d2d2d',
              border: '1px solid #333',
              borderLeft: `4px solid ${rec.priority === 'High' ? '#ff5459' : rec.priority === 'Medium' ? '#e68161' : '#fbbf24'}`,
              borderRadius: 8,
              padding: 20,
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', color: 'white', fontSize: 16 }}>{rec.supplement}</h4>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
              marginBottom: 12,
              background: rec.priority === 'High' ? 'rgba(255, 84, 89, 0.2)' : 
                          rec.priority === 'Medium' ? 'rgba(230, 129, 97, 0.2)' : 'rgba(251, 191, 36, 0.2)',
              color: rec.priority === 'High' ? '#ff5459' : rec.priority === 'Medium' ? '#e68161' : '#fbbf24',
            }}>
              {rec.priority} Priority
            </span>
            <div style={{ marginBottom: 12, color: 'white', fontSize: 13, lineHeight: 1.4 }}>
              {rec.reason}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#999' }}>
              <div><strong>ROI:</strong> {rec.roi}</div>
              <div><strong>Budget Impact:</strong> {rec.budgetImpact}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)', 
      color: 'var(--color-text)' 
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-16) 0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 16px',
        }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'white' }}>
            Supplement Archive
          </h1>
          {renderNavigation()}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px 0' }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 16px',
        }}>
          {currentView === 'library' && renderLibraryView()}
          {currentView === 'stack' && renderStackView()}
          {currentView === 'analytics' && renderAnalyticsView()}
          {currentView === 'recommendations' && renderRecommendationsView()}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <SupplementModal
          supplement={editingSupplement}
          onSave={handleSaveSupplement}
          onClose={() => {
            setShowModal(false);
            setEditingSupplement(null);
          }}
        />
      )}
    </div>
  );
};

export default SupplementArchive;