import React, { useState, useEffect } from 'react';
import { SupplementTask, DailyEntry, TaskEvaluationResult, ConditionRule } from '../types';
import {
  loadAndProcessSupplementsForToday,
  saveSupplements,
  overrideSupplementStatus,
  resetSupplementOverride,
  toggleSupplementCompletion,
  getSupplementStatusSummary,
  getSkippedSupplementsWithOverride,
  createDefaultSupplement,
  groupSupplementsByTiming,
  getTimingDisplay
} from '../utils/supplementUtils';
import { describeConditionRules } from '../utils/conditionEngine';
import { sampleConditionRules } from '../utils/conditionEngine';

const SupplementManager: React.FC = () => {
  const [supplements, setSupplements] = useState<SupplementTask[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<TaskEvaluationResult[]>([]);
  const [currentEntry, setCurrentEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSkippedDetails, setShowSkippedDetails] = useState(false);

  // Form state for adding new supplements
  const [newSupplementName, setNewSupplementName] = useState('');
  const [newSupplementCategory, setNewSupplementCategory] = useState('vitamins');
  const [newSupplementDosage, setNewSupplementDosage] = useState('');
  const [newSupplementTiming, setNewSupplementTiming] = useState<SupplementTask['timing']>('morning');
  const [selectedConditionTemplate, setSelectedConditionTemplate] = useState<string>('none');

  useEffect(() => {
    loadSupplements();
  }, []);

  const loadSupplements = async () => {
    setLoading(true);
    try {
      const result = await loadAndProcessSupplementsForToday();
      setSupplements(result.supplements);
      setEvaluationResults(result.evaluationResults);
      setCurrentEntry(result.entry);
    } catch (error) {
      console.error('Error loading supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplement = () => {
    if (!newSupplementName.trim()) return;

    const newSupplement = createDefaultSupplement(newSupplementName.trim(), newSupplementCategory);
    
    // Set additional properties
    newSupplement.dosage = newSupplementDosage.trim();
    newSupplement.timing = newSupplementTiming;
    
    // Add condition rules based on template
    if (selectedConditionTemplate !== 'none' && sampleConditionRules[selectedConditionTemplate as keyof typeof sampleConditionRules]) {
      newSupplement.conditionRules = sampleConditionRules[selectedConditionTemplate as keyof typeof sampleConditionRules];
      newSupplement.defaultActive = false; // Conditional supplements are inactive by default
    }

    const updatedSupplements = [...supplements, newSupplement];
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);

    // Reset form
    setNewSupplementName('');
    setNewSupplementCategory('vitamins');
    setNewSupplementDosage('');
    setNewSupplementTiming('morning');
    setSelectedConditionTemplate('none');
    setShowAddForm(false);

    // Reload to process conditions
    loadSupplements();
  };

  const handleOverrideSupplement = (supplementId: string, forceActive: boolean) => {
    const updatedSupplements = overrideSupplementStatus(supplements, supplementId, forceActive);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  };

  const handleResetOverride = (supplementId: string) => {
    if (!currentEntry) return;
    
    const updatedSupplements = resetSupplementOverride(supplements, supplementId, currentEntry);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  };

  const handleToggleCompletion = (supplementId: string) => {
    const updatedSupplements = toggleSupplementCompletion(supplements, supplementId);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  };

  const handleDeleteSupplement = (supplementId: string) => {
    const updatedSupplements = supplements.filter(s => s.id !== supplementId);
    setSupplements(updatedSupplements);
    saveSupplements(updatedSupplements);
  };

  const statusSummary = getSupplementStatusSummary(supplements);
  const skippedSupplements = getSkippedSupplementsWithOverride(supplements);
  const groupedSupplements = groupSupplementsByTiming(supplements.filter(s => s.isActive || s.isOverridden));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa44';
      case 'low': return '#44ff44';
      default: return '#888888';
    }
  };

  const getStatusBadge = (supplement: SupplementTask) => {
    if (supplement.isCompleted) {
      return <span style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Completed</span>;
    }
    if (supplement.isOverridden) {
      return <span style={{ color: '#17a2b8', fontWeight: 'bold' }}>🔧 Overridden</span>;
    }
    if (supplement.isSkipped) {
      return <span style={{ color: '#ffc107', fontWeight: 'bold' }}>⏭️ Skipped</span>;
    }
    if (supplement.isActive) {
      return <span style={{ color: '#007bff', fontWeight: 'bold' }}>🟢 Active</span>;
    }
    return <span style={{ color: '#6c757d' }}>⚪ Inactive</span>;
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading supplements...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>Supplement Manager</h2>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {showAddForm ? 'Cancel' : 'Add Supplement'}
          </button>
          <button
            onClick={loadSupplements}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>

        {/* Status Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{statusSummary.total}</div>
            <div>Total</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{statusSummary.active}</div>
            <div>Active</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{statusSummary.skipped}</div>
            <div>Skipped</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>{statusSummary.completed}</div>
            <div>Completed</div>
          </div>
        </div>
      </div>

      {/* Add Supplement Form */}
      {showAddForm && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3>Add New Supplement</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
              <input
                type="text"
                value={newSupplementName}
                onChange={(e) => setNewSupplementName(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="e.g., Vitamin D3"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
              <select
                value={newSupplementCategory}
                onChange={(e) => setNewSupplementCategory(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="vitamins">Vitamins</option>
                <option value="minerals">Minerals</option>
                <option value="herbs">Herbs</option>
                <option value="probiotics">Probiotics</option>
                <option value="omega">Omega-3</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Dosage:</label>
              <input
                type="text"
                value={newSupplementDosage}
                onChange={(e) => setNewSupplementDosage(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="e.g., 1000 IU"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Timing:</label>
              <select
                value={newSupplementTiming}
                onChange={(e) => setNewSupplementTiming(e.target.value as SupplementTask['timing'])}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="with_meal">With meals</option>
                <option value="before_bed">Before bed</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Conditional Rules:</label>
            <select
              value={selectedConditionTemplate}
              onChange={(e) => setSelectedConditionTemplate(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="none">Always active (no conditions)</option>
              <option value="lowEnergy">Only when energy &lt; 5</option>
              <option value="lowMood">Only when mood &lt; 5</option>
              <option value="poorSleep">Only when sleep &lt; 7 hours</option>
              <option value="lowEnergyOrMood">When energy &lt; 5 OR mood &lt; 5</option>
              <option value="noExercise">Only when no exercise</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddSupplement}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Supplement
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skipped Supplements with Override Options */}
      {skippedSupplements.length > 0 && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#856404' }}>⚠️ Skipped Supplements</h3>
          <p style={{ color: '#856404', marginBottom: '15px' }}>
            These supplements are skipped based on your current daily entry metrics, but you can override them:
          </p>
          {skippedSupplements.map(supplement => (
            <div key={supplement.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '5px',
              marginBottom: '10px',
              border: '1px solid #ddd'
            }}>
              <div style={{ flex: 1 }}>
                <strong>{supplement.title}</strong>
                {supplement.dosage && <span style={{ color: '#666' }}> - {supplement.dosage}</span>}
                <br />
                <small style={{ color: '#666' }}>
                  Skipped because: {describeConditionRules(supplement.conditionRules || [])}
                </small>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleOverrideSupplement(supplement.id, true)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Take Anyway
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Supplements by Timing */}
      {Object.entries(groupedSupplements).map(([timing, timingSupplements]) => {
        if (timingSupplements.length === 0) return null;
        
        return (
          <div key={timing} style={{ marginBottom: '30px' }}>
            <h3>{getTimingDisplay(timing as SupplementTask['timing'])}</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {timingSupplements.map(supplement => {
                const evalResult = evaluationResults.find(r => r.taskId === supplement.id);
                
                return (
                  <div
                    key={supplement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      backgroundColor: supplement.isCompleted ? '#d4edda' : '#ffffff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getPriorityColor(supplement.priority)}`
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={supplement.isCompleted}
                      onChange={() => handleToggleCompletion(supplement.id)}
                      style={{
                        marginRight: '15px',
                        transform: 'scale(1.2)',
                        cursor: 'pointer'
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '5px'
                      }}>
                        <h4 style={{
                          margin: '0 10px 0 0',
                          textDecoration: supplement.isCompleted ? 'line-through' : 'none',
                          color: supplement.isCompleted ? '#666' : '#333'
                        }}>
                          {supplement.title}
                        </h4>
                        {getStatusBadge(supplement)}
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        {supplement.dosage && <span>Dosage: {supplement.dosage} | </span>}
                        <span>Category: {supplement.category} | </span>
                        <span>Priority: {supplement.priority}</span>
                      </div>
                      
                      {supplement.conditionRules && supplement.conditionRules.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          Conditions: {describeConditionRules(supplement.conditionRules)}
                        </div>
                      )}
                      
                      {evalResult && evalResult.evaluatedRules.length > 0 && showSkippedDetails && (
                        <div style={{
                          fontSize: '11px',
                          color: '#555',
                          backgroundColor: '#f8f9fa',
                          padding: '8px',
                          borderRadius: '4px',
                          marginTop: '8px'
                        }}>
                          <strong>Evaluation Details:</strong>
                          {evalResult.evaluatedRules.map((rule, idx) => (
                            <div key={idx}>{rule.reason}</div>
                          ))}
                          <div><strong>Result:</strong> {evalResult.finalReason}</div>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                      {supplement.isOverridden && (
                        <button
                          onClick={() => handleResetOverride(supplement.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Reset Override
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSupplement(supplement.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {supplements.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          <h3>No supplements yet</h3>
          <p>Add your first supplement to start tracking!</p>
        </div>
      )}

      {/* Debug Panel */}
      {evaluationResults.length > 0 && (
        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f1f3f4',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <h4>Debug Information</h4>
            <button
              onClick={() => setShowSkippedDetails(!showSkippedDetails)}
              style={{
                marginLeft: '15px',
                padding: '5px 10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {showSkippedDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Current Entry: {currentEntry ? `${currentEntry.date} (mood: ${currentEntry.mood}, energy: ${currentEntry.energy}, sleep: ${currentEntry.sleep}h, exercise: ${currentEntry.exercise ? 'yes' : 'no'})` : 'None'}
            <br />
            Evaluations: {evaluationResults.length} tasks processed
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplementManager;
