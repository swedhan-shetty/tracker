# Data Export Implementation

This document describes the comprehensive data export functionality implemented in the Daily Tracker application.

## Overview

The data export system provides users with the ability to export all their tracking data in both JSON and CSV formats using client-side file downloads with Blob and URL.createObjectURL APIs.

## Core Requirements Implemented

✅ **Export button in Analytics view**  
✅ **JSON and CSV format compilation**  
✅ **Client-side file download using Blob and URL.createObjectURL**  
✅ **Comprehensive data inclusion: task definitions, daily entries, and notes**

## Implementation Details

### Key Files Created

1. **`src/utils/exportUtils.ts`** - Core export utilities (384 lines)
2. **`src/components/ExportTest.tsx`** - Test component for validation (324 lines)
3. **Updated `src/components/Analytics.tsx`** - Integrated export functionality
4. **Updated App.tsx & Header.tsx** - Added test view navigation

### Export Data Structure

#### JSON Export Format

```typescript
interface ExportData {
  metadata: {
    exportDate: string;           // ISO timestamp
    version: string;              // Export format version
    totalEntries: number;         // Count statistics
    totalTasks: number;
    totalSupplements: number;
    dateRange: {
      startDate: string;          // First entry date
      endDate: string;            // Last entry date
    };
  };
  dailyEntries: DailyEntry[];     // Complete daily tracking data
  simpleTasks: SimpleTask[];      // Simple task definitions
  supplements: SupplementTask[];  // Supplement configurations
  habits: Habit[];               // Habit definitions
}
```

#### CSV Export Format

The CSV export provides a multi-section format:

```csv
=== EXPORT METADATA ===
Export Date,2025-01-09T18:19:45.123Z
Version,1.0.0
Total Entries,14
...

=== DAILY ENTRIES ===
entryId,date,mood,energy,productivity,sleep,exercise,notes,totalGoals,completedGoals,goalCompletionRate,goalsList,completedGoalsList,totalHabits,completedHabits
entry-2025-01-08,2025-01-08,7,6,5,8,true,"Sample notes",4,3,75,"Read; Exercise; Meditate; Walk","Read; Exercise; Walk",0,0
...

=== SIMPLE TASKS ===
id,title,description,completed,priority,streakCount
simple-task-0,Check emails,Sample simple task: Check emails,true,medium,3
...

=== SUPPLEMENTS ===
id,title,type,category,dosage,timing,isCompleted,conditionRules
supplement-0,Vitamin D3,supplement,vitamins,1000 IU,morning,true,
...
```

## Core Functions

### Data Compilation

```typescript
// Compile all localStorage data into structured format
compileAllData(): ExportData

// Get summary of available data
getExportSummary(): {
  hasData: boolean;
  entriesCount: number;
  tasksCount: number;
  supplementsCount: number;
  habitsCount: number;
  dateRange: string;
}
```

### Format Conversion

```typescript
// Convert to JSON with pretty formatting
convertToJSON(data: ExportData): string

// Convert to CSV with multiple sections
convertToCSV(data: ExportData): string

// Flatten complex daily entries for CSV
flattenDailyEntries(dailyEntries: DailyEntry[]): FlattenedEntry[]
```

### File Download

```typescript
// Client-side file download using Blob API
downloadFile(content: string, filename: string, contentType: string): void

// Generate timestamped filenames
generateTimestampedFilename(baseName: string, extension: string): string
```

### Export Functions

```typescript
// Export specific formats
exportAsJSON(): Promise<void>
exportAsCSV(): Promise<void>
exportBothFormats(): Promise<void>  // Downloads both files with delay
```

## User Interface Integration

### Analytics View Export Section

Located in the Analytics component with:
- **Export JSON Button** - Downloads structured JSON file
- **Export CSV Button** - Downloads spreadsheet-compatible CSV
- **Export Both Button** - Downloads both formats sequentially
- **Data Summary Display** - Shows counts of data to be exported
- **Error Handling** - Visual feedback for export failures
- **Loading States** - Prevents multiple simultaneous exports

### Export Test Component

Comprehensive testing interface with:
- **Data Summary Panel** - Current localStorage contents
- **Test Data Management** - Generate/clear sample data
- **Export Controls** - All export functions
- **Preview Functionality** - View formatted output before download
- **Status Feedback** - Success/error messages
- **Testing Instructions** - Step-by-step validation guide

## Data Processing Pipeline

### 1. Data Collection
```
localStorage Keys → Parse JSON → Validate Data
├── 'dailyEntries'
├── 'simpleTasks'  
├── 'supplements'
└── 'habits'
```

### 2. Data Compilation
```
Raw Data → Structured ExportData → Metadata Generation
├── Count statistics
├── Date range calculation
└── Timestamp addition
```

### 3. Format Conversion
```
ExportData → Format-Specific Processing → String Output
├── JSON: Pretty printing with indentation
└── CSV: Multi-section with proper escaping
```

### 4. File Generation
```
String Content → Blob Creation → URL Generation → Download Trigger
├── Blob([content], {type: mimeType})
├── URL.createObjectURL(blob)
├── <a> element with download attribute
└── Cleanup: URL.revokeObjectURL()
```

## CSV Data Flattening

### Daily Entries Flattening

Complex daily entries are flattened for CSV compatibility:

```typescript
interface FlattenedEntry {
  // Entry metadata
  entryId: string;
  date: string;
  
  // Daily metrics  
  mood: number;
  energy: number;
  productivity: number;
  sleep: number;
  exercise: boolean;
  notes: string;
  
  // Task summaries
  totalGoals: number;
  completedGoals: number;
  goalCompletionRate: number;
  
  // Flattened lists
  goalsList: string;           // "Read; Exercise; Meditate"
  completedGoalsList: string;  // "Read; Exercise"
  
  // Habit summaries
  totalHabits: number;
  completedHabits: number;
}
```

### CSV Escaping

Handles special characters properly:
- **Commas**: Wrap in quotes
- **Quotes**: Escape as double quotes (`""`)  
- **Newlines**: Wrap in quotes
- **Null/undefined**: Convert to empty string

## File Download Implementation

### Browser Compatibility

Uses modern Web APIs with broad support:
- **Blob API**: Creates file-like objects
- **URL.createObjectURL()**: Generates downloadable URLs
- **HTML5 download attribute**: Triggers file download
- **Cross-browser compatibility**: Works in Chrome, Firefox, Safari, Edge

### Download Process

```typescript
function downloadFile(content: string, filename: string, contentType: string) {
  // 1. Create Blob with content and MIME type
  const blob = new Blob([content], { type: contentType });
  
  // 2. Generate object URL
  const url = URL.createObjectURL(blob);
  
  // 3. Create temporary download link
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  
  // 4. Trigger download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  
  // 5. Cleanup
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
```

### Filename Generation

Generates timestamped filenames to prevent conflicts:
- **Format**: `daily_tracker_export_YYYY-MM-DD.{json|csv}`
- **Example**: `daily_tracker_export_2025-01-09.json`

## Error Handling

### Comprehensive Error Management

```typescript
try {
  const data = compileAllData();
  const jsonContent = convertToJSON(data);
  downloadFile(jsonContent, filename, 'application/json');
} catch (error) {
  // User feedback via UI
  setExportError(error.message);
  // Console logging for debugging
  console.error('Export error:', error);
}
```

### Error Scenarios Handled

- **localStorage unavailable**: Graceful fallback
- **JSON parsing errors**: Invalid data handling
- **Blob creation failures**: Browser compatibility issues
- **Download failures**: User notification
- **Large data sets**: Memory management

## Testing & Validation

### Test Component Features

1. **Data Summary Display**
   - Real-time localStorage content
   - Entry/task/supplement counts
   - Date range information

2. **Sample Data Generation**
   - 14 days of realistic test data
   - Multiple task types and completion patterns
   - Varied daily metrics

3. **Preview Functionality**
   - View JSON/CSV output before download
   - Truncated preview for large datasets
   - Formatted display with syntax highlighting

4. **Export Validation**
   - Success/error status display
   - File download confirmation
   - Multi-format testing

### Testing Workflow

1. **Generate Sample Data**
   ```
   Click "Generate Sample Data" → 14 days created
   ```

2. **Preview Output**
   ```
   Click "Preview JSON/CSV" → View formatted data
   ```

3. **Test Downloads**
   ```
   Click export buttons → Files downloaded to browser
   ```

4. **Validate Files**
   ```
   Open in appropriate apps → Verify data integrity
   ```

## Performance Considerations

### Memory Management

- **On-demand processing**: Data compiled only when needed
- **Efficient string handling**: Single pass CSV generation
- **Blob cleanup**: URLs revoked after download
- **Preview truncation**: Large datasets limited to 5KB preview

### Large Dataset Handling

- **Streaming not required**: Client-side data assumed reasonable size
- **Memory limits**: Browser handles Blob size limits gracefully
- **Progress feedback**: Loading states for user awareness

## Security Considerations

### Data Privacy

- **Client-side only**: No data transmitted to servers
- **Local processing**: All compilation done in browser
- **User control**: Data exported only on explicit user action
- **Temporary URLs**: Object URLs cleaned up immediately

### Content Safety

- **CSV injection prevention**: Proper escaping of special characters
- **XSS prevention**: No dynamic script execution
- **File type validation**: Explicit MIME types set

## Browser Support

### Modern Browser Requirements

- **Blob API**: Supported in all modern browsers
- **URL.createObjectURL**: IE 10+, all modern browsers
- **Download attribute**: Chrome, Firefox, Safari, Edge
- **localStorage**: Universal support

### Fallback Strategies

- **Feature detection**: Check API availability
- **Error messaging**: Clear user feedback for unsupported browsers
- **Graceful degradation**: Core app functionality unaffected

## Usage Examples

### Basic Export (Analytics View)

```typescript
// User clicks "Export JSON" button
handleExport('json')
  ↓
exportAsJSON()
  ↓
compileAllData() → convertToJSON() → downloadFile()
  ↓
File downloaded: daily_tracker_export_2025-01-09.json
```

### Programmatic Export

```typescript
import { exportAsJSON, exportAsCSV, getExportSummary } from '../utils/exportUtils';

// Check if data exists
const summary = getExportSummary();
if (summary.hasData) {
  // Export both formats
  await exportAsJSON();
  await exportAsCSV();
}
```

### Custom Export Processing

```typescript
import { compileAllData, convertToJSON } from '../utils/exportUtils';

// Get raw export data
const data = compileAllData();

// Process for external API
const processedData = {
  entries: data.dailyEntries.map(entry => ({
    date: entry.date,
    mood: entry.mood,
    notes: entry.notes
  }))
};

// Send to external service
await sendToExternalAPI(processedData);
```

## Future Enhancements

### Planned Features

- **Selective Export**: Choose date ranges or specific data types
- **Import Functionality**: Restore data from exported files
- **Cloud Sync**: Export to cloud storage services
- **Scheduled Exports**: Automatic periodic backups
- **Data Compression**: ZIP archives for large datasets
- **Custom Formats**: PDF reports, Excel files

### Integration Opportunities

- **Email Export**: Send exports via email
- **Social Sharing**: Share summary data
- **Data Visualization**: Export charts and graphs
- **Third-party Integration**: Export to fitness apps, calendars

## API Reference

### Export Functions

```typescript
// Main export functions
exportAsJSON(): Promise<void>
exportAsCSV(): Promise<void>
exportBothFormats(): Promise<void>

// Data compilation
compileAllData(): ExportData
getExportSummary(): ExportSummary

// Format conversion
convertToJSON(data: ExportData): string
convertToCSV(data: ExportData): string
flattenDailyEntries(entries: DailyEntry[]): FlattenedEntry[]

// Utility functions
downloadFile(content: string, filename: string, contentType: string): void
generateTimestampedFilename(baseName: string, extension: string): string
```

### Data Types

```typescript
interface ExportData {
  metadata: ExportMetadata;
  dailyEntries: DailyEntry[];
  simpleTasks: SimpleTask[];
  supplements: SupplementTask[];
  habits: Habit[];
}

interface ExportSummary {
  hasData: boolean;
  entriesCount: number;
  tasksCount: number;
  supplementsCount: number;
  habitsCount: number;
  dateRange: string;
}
```

This comprehensive export system provides users with complete control over their data while maintaining security and performance through client-side processing and modern web APIs.
