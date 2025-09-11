import React, { useState } from 'react';
import {
  exportAsJSON,
  exportAsCSV,
  exportBothFormats,
  getExportSummary,
  compileAllData,
  convertToJSON,
  convertToCSV
} from '../utils/exportUtils';
import {
  populateLocalStorageWithSampleData,
  clearAllLocalStorageData
} from '../utils/sampleDataGenerator';

const ExportTest: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [previewData, setPreviewData] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const handleExport = async (format: 'json' | 'csv' | 'both') => {
    setIsExporting(true);
    setExportStatus('Exporting...');

    try {
      switch (format) {
        case 'json':
          await exportAsJSON();
          setExportStatus('JSON export successful!');
          break;
        case 'csv':
          await exportAsCSV();
          setExportStatus('CSV export successful!');
          break;
        case 'both':
          await exportBothFormats();
          setExportStatus('Both formats exported successfully!');
          break;
      }
    } catch (error) {
      setExportStatus(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async (format: 'json' | 'csv') => {
    try {
      const data = compileAllData();
      let preview: string;
      
      if (format === 'json') {
        preview = convertToJSON(data);
      } else {
        preview = convertToCSV(data);
      }
      
      // Truncate preview if too long
      if (preview.length > 5000) {
        preview = preview.substring(0, 5000) + '\n\n... [truncated for preview]';
      }
      
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      setPreviewData(`Error generating preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowPreview(true);
    }
  };

  const summary = getExportSummary();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Export Functionality Test</h2>
      
      {/* Data Summary */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <h4>Current Data Summary</h4>
        <p><strong>Has Data:</strong> {summary.hasData ? 'Yes' : 'No'}</p>
        <p><strong>Daily Entries:</strong> {summary.entriesCount}</p>
        <p><strong>Simple Tasks:</strong> {summary.tasksCount}</p>
        <p><strong>Supplements:</strong> {summary.supplementsCount}</p>
        <p><strong>Habits:</strong> {summary.habitsCount}</p>
        <p><strong>Date Range:</strong> {summary.dateRange}</p>
      </div>

      {/* Data Management */}
      <div style={{
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>Test Data Management</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              populateLocalStorageWithSampleData(14); // 2 weeks of data
              setExportStatus('Generated 14 days of sample data');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Generate Sample Data
          </button>
          <button
            onClick={() => {
              clearAllLocalStorageData();
              setExportStatus('Cleared all data');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Export Controls */}
      <div style={{
        padding: '15px',
        backgroundColor: '#e8f4f8',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #b8daff'
      }}>
        <h4>Export Functions</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              backgroundColor: isExporting ? '#6c757d' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isExporting ? 'not-allowed' : 'pointer'
            }}
          >
            Export JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              backgroundColor: isExporting ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isExporting ? 'not-allowed' : 'pointer'
            }}
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('both')}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              backgroundColor: isExporting ? '#6c757d' : '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isExporting ? 'not-allowed' : 'pointer'
            }}
          >
            Export Both
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <button
            onClick={() => handlePreview('json')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Preview JSON
          </button>
          <button
            onClick={() => handlePreview('csv')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Preview CSV
          </button>
        </div>

        {exportStatus && (
          <div style={{
            padding: '10px',
            backgroundColor: exportStatus.includes('failed') || exportStatus.includes('Error') ? '#f8d7da' : '#d4edda',
            color: exportStatus.includes('failed') || exportStatus.includes('Error') ? '#721c24' : '#155724',
            borderRadius: '4px',
            border: `1px solid ${exportStatus.includes('failed') || exportStatus.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {exportStatus}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h4>Export Preview</h4>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '60vh',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {previewData}
            </pre>
          </div>
        </div>
      )}

      {/* Test Instructions */}
      <div style={{
        padding: '15px',
        backgroundColor: '#d1ecf1',
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h4>Testing Instructions</h4>
        <ol style={{ fontSize: '14px', lineHeight: 1.6 }}>
          <li>Click "Generate Sample Data" to create test data</li>
          <li>Use "Preview JSON" or "Preview CSV" to see formatted output</li>
          <li>Click export buttons to download files</li>
          <li>Check your Downloads folder for exported files</li>
          <li>Open files in appropriate applications (JSON in text editor, CSV in Excel)</li>
          <li>Verify all data is present and correctly formatted</li>
        </ol>
        
        <h5>Expected File Names:</h5>
        <ul style={{ fontSize: '14px' }}>
          <li><code>daily_tracker_export_YYYY-MM-DD.json</code></li>
          <li><code>daily_tracker_export_YYYY-MM-DD.csv</code></li>
        </ul>
      </div>
    </div>
  );
};

export default ExportTest;
