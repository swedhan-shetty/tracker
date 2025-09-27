import React from 'react';
import { SupplementCategory } from '../../types/supplements';

interface AnalyticsChartsProps {
  monthlySpending: Record<string, number>;
  currentStackByCategory: Record<SupplementCategory, number>;
  budget: {
    monthly: number;
    yearly: number;
  };
  supplementStats: {
    totalSupplements: number;
    stackSupplements: number;
    monthlyCost: number;
    budgetRemaining: number;
  };
}

const categoryColors = {
  'Essential Lifelong': '#4ade80',
  'Goal-Specific': '#60a5fa',
  'Uncertain/Trial': '#fbbf24',
  'Wishlist': '#a78bfa',
};

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  monthlySpending,
  currentStackByCategory,
  budget,
  supplementStats,
}) => {
  const budgetUtilization = (supplementStats.monthlyCost / budget.monthly) * 100;
  const totalCategoryCost = Object.values(currentStackByCategory).reduce((sum, cost) => sum + cost, 0);

  const renderProgressBar = (value: number, max: number, color: string, label: string) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 8 
      }}>
        <span style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, color: '#999' }}>
          ₹{value} / ₹{max} ({Math.round((value / max) * 100)}%)
        </span>
      </div>
      <div style={{
        background: '#333',
        borderRadius: 10,
        height: 20,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          style={{
            background: color,
            height: '100%',
            width: `${Math.min((value / max) * 100, 100)}%`,
            transition: 'width 0.3s ease',
            borderRadius: 10,
          }}
        />
        {value > max && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '100%',
              width: `${((value - max) / max) * 100}%`,
              height: '100%',
              background: '#ff5459',
              opacity: 0.8,
            }}
          />
        )}
      </div>
    </div>
  );

  const renderCategoryChart = () => {
    const categories = Object.keys(currentStackByCategory) as SupplementCategory[];
    const maxCost = Math.max(...Object.values(currentStackByCategory), 1);

    return (
      <div style={{
        background: '#2d2d2d',
        border: '1px solid #333',
        borderRadius: 12,
        padding: 24,
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, color: 'white' }}>
          Cost by Category
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {categories.map(category => {
            const cost = currentStackByCategory[category];
            if (cost === 0) return null;

            return (
              <div key={category}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 8 
                }}>
                  <span style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>
                    {category}
                  </span>
                  <span style={{ fontSize: 14, color: '#999' }}>
                    ₹{cost} ({Math.round((cost / totalCategoryCost) * 100)}%)
                  </span>
                </div>
                <div style={{
                  background: '#333',
                  borderRadius: 8,
                  height: 16,
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      background: categoryColors[category],
                      height: '100%',
                      width: `${(cost / maxCost) * 100}%`,
                      transition: 'width 0.3s ease',
                      borderRadius: 8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {totalCategoryCost === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            fontStyle: 'italic', 
            padding: 20 
          }}>
            No supplements in current stack with cost data
          </div>
        )}
      </div>
    );
  };

  const renderBudgetOverview = () => (
    <div style={{
      background: '#2d2d2d',
      border: '1px solid #333',
      borderRadius: 12,
      padding: 24,
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: 18, color: 'white' }}>
        Budget Overview
      </h3>

      {renderProgressBar(
        supplementStats.monthlyCost,
        budget.monthly,
        budgetUtilization > 100 ? '#ff5459' : budgetUtilization > 80 ? '#fbbf24' : '#4ade80',
        'Monthly Budget Usage'
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: 16,
        marginTop: 20 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>
            ₹{supplementStats.monthlyCost}
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Spending
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: supplementStats.budgetRemaining < 0 ? '#ff5459' : '#4ade80' }}>
            ₹{supplementStats.budgetRemaining}
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Remaining
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
            {Math.round(budgetUtilization)}%
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Budget Used
          </div>
        </div>
      </div>
    </div>
  );

  const renderStackStats = () => (
    <div style={{
      background: '#2d2d2d',
      border: '1px solid #333',
      borderRadius: 12,
      padding: 24,
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: 18, color: 'white' }}>
        Stack Statistics
      </h3>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: 16 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#4ade80' }}>
            {supplementStats.stackSupplements}
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            In Stack
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#60a5fa' }}>
            {supplementStats.totalSupplements}
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Library
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fbbf24' }}>
            {supplementStats.totalSupplements > 0 ? 
              Math.round((supplementStats.stackSupplements / supplementStats.totalSupplements) * 100) : 0}%
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Stack Ratio
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#a78bfa' }}>
            ₹{supplementStats.stackSupplements > 0 ? Math.round(supplementStats.monthlyCost / supplementStats.stackSupplements) : 0}
          </div>
          <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Cost
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpendingTrend = () => {
    const months = Object.keys(monthlySpending).sort();
    const hasSpendingData = months.length > 0 && Object.values(monthlySpending).some(val => val > 0);

    return (
      <div style={{
        background: '#2d2d2d',
        border: '1px solid #333',
        borderRadius: 12,
        padding: 24,
        gridColumn: '1 / -1',
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 18, color: 'white' }}>
          Monthly Spending Trend
        </h3>

        {!hasSpendingData ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            fontStyle: 'italic', 
            padding: 40 
          }}>
            No spending data available yet. Start tracking your supplements to see trends!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {months.slice(-6).map(month => {
              const spending = monthlySpending[month] || 0;
              const maxSpending = Math.max(...Object.values(monthlySpending), budget.monthly);

              return (
                <div key={month}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 6 
                  }}>
                    <span style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>
                      {new Date(month + '-01').toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span style={{ fontSize: 14, color: '#999' }}>₹{spending}</span>
                  </div>
                  <div style={{
                    background: '#333',
                    borderRadius: 6,
                    height: 12,
                    overflow: 'hidden',
                  }}>
                    <div
                      style={{
                        background: spending > budget.monthly ? '#ff5459' : '#4ade80',
                        height: '100%',
                        width: `${Math.min((spending / maxSpending) * 100, 100)}%`,
                        transition: 'width 0.3s ease',
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 24,
    }}>
      {renderBudgetOverview()}
      {renderStackStats()}
      {renderCategoryChart()}
      {renderSpendingTrend()}
    </div>
  );
};

export default AnalyticsCharts;