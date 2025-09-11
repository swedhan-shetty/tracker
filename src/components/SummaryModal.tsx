import React, { useState } from 'react';
import { SummaryResponse, saveSummaryToStorage, SavedSummary } from '../utils/openAIUtils';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: SummaryResponse | null;
  dateRange: { startDate: string; endDate: string } | null;
  isLoading: boolean;
  error: string | null;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  dateRange,
  isLoading,
  error
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSaveToNotes = async () => {
    if (!summary || !dateRange) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const savedSummary = saveSummaryToStorage(summary, dateRange);
      setSaveStatus('success');
      console.log('Summary saved:', savedSummary);
      
      // Auto-close success message after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving summary:', error);
      setSaveStatus('error');
      
      // Auto-hide error after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSaveStatus('idle');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e9ecef',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderRadius: '12px 12px 0 0',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h2 style={{ margin: 0, color: '#333' }}>
              🤖 AI Weekly Summary
            </h2>
            <button
              onClick={handleClose}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close"
            >
              ×
            </button>
          </div>
          
          {dateRange && (
            <div style={{ fontSize: '14px', color: '#666' }}>
              {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Loading State */}
          {isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <div style={{
                marginBottom: '20px',
                fontSize: '48px'
              }}>
                🧠
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                Generating Your Summary...
              </div>
              <div style={{
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                AI is analyzing your weekly data to provide insights and recommendations.
              </div>
              <div style={{
                width: '200px',
                height: '4px',
                backgroundColor: '#e9ecef',
                borderRadius: '2px',
                margin: '0 auto',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#007bff',
                    animation: 'progress 2s ease-in-out infinite',
                    transformOrigin: 'left'
                  }}
                />
              </div>
              <style>{`
                @keyframes progress {
                  0% { transform: scaleX(0); }
                  50% { transform: scaleX(1); }
                  100% { transform: scaleX(0); }
                }
              `}</style>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>
                ⚠️
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#dc3545',
                marginBottom: '10px'
              }}>
                Summary Generation Failed
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
                lineHeight: 1.5
              }}>
                {error}
              </div>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          )}

          {/* Success State - Display Summary */}
          {summary && !isLoading && !error && (
            <div>
              {/* Main Summary */}
              <div style={{
                marginBottom: '30px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#333',
                    flex: 1
                  }}>
                    📝 Summary
                  </h3>
                  {summary.confidence && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '12px'
                    }}>
                      <span style={{ marginRight: '5px', color: '#666' }}>
                        Confidence:
                      </span>
                      <span style={{
                        color: getConfidenceColor(summary.confidence),
                        fontWeight: 'bold'
                      }}>
                        {getConfidenceLabel(summary.confidence)} ({Math.round(summary.confidence * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  lineHeight: 1.6,
                  fontSize: '16px',
                  color: '#333',
                  border: '1px solid #e9ecef'
                }}>
                  {summary.summary}
                </div>
              </div>

              {/* Insights */}
              {summary.insights && summary.insights.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    color: '#333'
                  }}>
                    💡 Key Insights
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {summary.insights.map((insight, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '15px',
                          backgroundColor: '#e8f4f8',
                          borderRadius: '6px',
                          borderLeft: '4px solid #17a2b8',
                          fontSize: '14px',
                          lineHeight: 1.5
                        }}
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {summary.recommendations && summary.recommendations.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    color: '#333'
                  }}>
                    🎯 Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {summary.recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '15px',
                          backgroundColor: '#f8f5e8',
                          borderRadius: '6px',
                          borderLeft: '4px solid #ffc107',
                          fontSize: '14px',
                          lineHeight: 1.5
                        }}
                      >
                        {recommendation}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #e9ecef'
              }}>
                Generated on {new Date(summary.generatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {summary && !isLoading && !error && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa',
            borderRadius: '0 0 12px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveToNotes}
                disabled={isSaving}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isSaving ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSaving ? (
                  <>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save to Notes</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '1px solid #6c757d',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>

            {/* Save Status */}
            {saveStatus !== 'idle' && (
              <div style={{
                fontSize: '14px',
                padding: '5px 10px',
                borderRadius: '4px',
                ...(saveStatus === 'success' ? {
                  color: '#155724',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb'
                } : {
                  color: '#721c24',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb'
                })
              }}>
                {saveStatus === 'success' ? '✅ Summary saved!' : '❌ Save failed'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryModal;
