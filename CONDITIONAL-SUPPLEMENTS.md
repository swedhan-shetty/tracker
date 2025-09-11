# Conditional Supplement System

This document describes the comprehensive conditional trigger logic system for supplements in the Daily Tracker application.

## Overview

The conditional supplement system allows supplements to be automatically activated or deactivated based on daily entry metrics. This enables smart supplement recommendations that adapt to your current state.

## System Architecture

### Core Components

1. **CoreTask Model** - Extended task interface with conditional rules
2. **SupplementTask** - Specialized supplement implementation of CoreTask  
3. **ConditionRule** - Rule definition for conditional logic
4. **Condition Engine** - Rule evaluation and processing system
5. **Supplement Manager** - UI and management interface

### Rule Syntax

Rules use the following structure:

```typescript
interface ConditionRule {
  metric: 'mood' | 'energy' | 'productivity' | 'sleep' | 'exercise';
  comparator: '<' | '>' | '=' | '<=' | '>=' | '!=';
  value: number | boolean;
  logicOperator?: 'AND' | 'OR';
}
```

### Example Rules

```javascript
// Take Vitamin D only when energy is low
{ metric: "energy", comparator: "<", value: 5 }

// Take B-Complex when mood is low OR energy is low
[
  { metric: "mood", comparator: "<", value: 5 },
  { metric: "energy", comparator: "<", value: 5, logicOperator: "OR" }
]

// Take Melatonin only when sleep was poor and no exercise
[
  { metric: "sleep", comparator: "<", value: 7 },
  { metric: "exercise", comparator: "=", value: false, logicOperator: "AND" }
]
```

## Key Features

### ✅ Automatic Evaluation
- Supplements automatically evaluated when daily entry is loaded
- Active/inactive status determined by condition rules
- Real-time updates when metrics change

### ✅ Override System
- Users can manually override conditional decisions
- "Take Anyway" button for skipped supplements
- "Reset Override" to return to automatic evaluation

### ✅ Visual Feedback
- Clear status indicators (Active, Skipped, Completed, Overridden)
- Warning section for skipped supplements with override options
- Detailed evaluation results in debug mode

### ✅ Smart Organization
- Supplements grouped by timing (morning, afternoon, etc.)
- Priority color coding
- Status summaries and statistics

### ✅ Flexible Rule Templates
- Pre-defined templates for common scenarios
- Low energy supplements
- Mood support supplements
- Sleep quality dependent supplements
- Exercise recovery supplements

## Usage Examples

### Basic Usage

```typescript
import { useSupplements } from '../hooks/useSupplements';

function MyComponent() {
  const {
    supplements,
    statusSummary,
    skippedWithOverride,
    overrideSupplement,
    toggleCompletion
  } = useSupplements();

  // Override a skipped supplement
  const handleOverride = (supplementId: string) => {
    overrideSupplement(supplementId, true);
  };

  // Toggle completion
  const handleToggle = (supplementId: string) => {
    toggleCompletion(supplementId);
  };

  return (
    <div>
      <h3>Status: {statusSummary.active} active, {statusSummary.skipped} skipped</h3>
      
      {skippedWithOverride.map(supplement => (
        <div key={supplement.id}>
          <span>{supplement.title} - Skipped</span>
          <button onClick={() => handleOverride(supplement.id)}>
            Take Anyway
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Creating Custom Rules

```typescript
import { ConditionRule } from '../types';
import { sampleConditionRules } from '../utils/conditionEngine';

// Use pre-defined template
const lowEnergyRules = sampleConditionRules.lowEnergy;

// Create custom rule
const customRule: ConditionRule[] = [
  { metric: 'mood', comparator: '<', value: 4 },
  { metric: 'sleep', comparator: '<', value: 6, logicOperator: 'AND' }
];

// Add to supplement
const supplement = {
  title: 'St. Johns Wort',
  conditionRules: customRule,
  defaultActive: false  // Only active when conditions are met
};
```

## UI Components

### SupplementManager Component

Full-featured supplement management interface:

- ✅ Add/edit/delete supplements
- ✅ Configure conditional rules via templates
- ✅ View skipped supplements with override options
- ✅ Organize by timing categories
- ✅ Status indicators and summaries
- ✅ Debug information panel

### Status Indicators

- **🟢 Active** - Supplement should be taken (conditions met)
- **⏭️ Skipped** - Conditions not met, automatically skipped
- **✅ Completed** - User has marked as taken
- **🔧 Overridden** - User manually activated despite conditions
- **⚪ Inactive** - No conditions defined, default inactive

### Override Options

Skipped supplements are shown in a warning panel with:
- Clear explanation of why they were skipped
- "Take Anyway" button to override conditions
- Condition rule descriptions in human-readable format

## Data Flow

1. **Daily Entry Creation/Update**
   - User enters mood, energy, sleep, exercise data
   - Daily entry saved to localStorage

2. **Supplement Evaluation**
   - All supplements loaded from localStorage  
   - Each supplement's conditions evaluated against entry
   - Active/inactive status updated

3. **UI Updates**
   - Active supplements shown in timing groups
   - Skipped supplements shown in warning panel
   - Status summary updated

4. **User Interaction**
   - User can override skipped supplements
   - Completion status tracked independently
   - Override status persisted

## Storage Structure

### localStorage Keys

- `supplements` - Array of SupplementTask objects
- `dailyEntries` - Array of DailyEntry objects (existing)

### Sample Data

```javascript
// Sample supplement with conditions
{
  "id": "supplement-123",
  "title": "Vitamin D3",
  "type": "supplement",
  "category": "vitamins",
  "dosage": "2000 IU",
  "timing": "morning",
  "isActive": false,
  "isSkipped": true,
  "isCompleted": false,
  "isOverridden": false,
  "defaultActive": false,
  "conditionRules": [
    {
      "metric": "energy",
      "comparator": "<", 
      "value": 5
    }
  ]
}
```

## Testing Scenarios

### Test Case 1: Low Energy Trigger
1. Create supplement with rule: `energy < 5`
2. Create daily entry with `energy: 3`
3. Verify supplement is active
4. Update entry with `energy: 7`
5. Verify supplement is skipped

### Test Case 2: Override System
1. Have supplement skipped due to conditions
2. Use "Take Anyway" to override
3. Verify status shows as "Overridden"  
4. Use "Reset Override" 
5. Verify returns to condition-based status

### Test Case 3: Complex Rules
1. Create supplement with rule: `mood < 5 OR energy < 5`
2. Test with `mood: 3, energy: 8` → Should be active
3. Test with `mood: 8, energy: 3` → Should be active  
4. Test with `mood: 8, energy: 8` → Should be skipped

### Test Case 4: Multiple Timing Groups
1. Create morning supplement (active)
2. Create evening supplement (skipped)
3. Verify proper grouping in UI
4. Verify only active ones show in timing sections

## Integration Points

### Daily Entry Form Integration
- Automatic supplement re-evaluation when entry saved
- Optional supplement suggestions in entry form
- Integration with existing daily metrics

### Dashboard Integration
- Supplement completion statistics
- Conditional trigger insights
- Daily supplement adherence tracking

## Performance Considerations

### Evaluation Efficiency
- O(n) evaluation per supplement where n = number of rules
- Batch processing of multiple supplements
- Caching of evaluation results

### Storage Optimization
- Compact rule representation
- Efficient localStorage usage
- Minimal redundant data

### UI Responsiveness
- Lazy loading of evaluation details
- Progressive disclosure of debug information
- Responsive design for mobile usage

## Future Enhancements

### Planned Features
- Historical compliance tracking
- Smart rule suggestions based on patterns
- Integration with habit tracking
- Export/import of supplement configurations
- Advanced rule builder UI

### Possible Extensions
- Time-based conditions (day of week, season)
- External data integration (weather, calendar)
- Machine learning rule optimization
- Social sharing of effective supplement routines

## Error Handling

### Graceful Degradation
- Invalid rules default to inactive
- Missing data uses default values  
- LocalStorage errors don't crash app
- Clear error messages for users

### Validation
- Rule syntax validation on creation
- Type checking for metric values
- Logical consistency verification
- User-friendly error feedback

## API Reference

### Core Functions

```typescript
// Rule evaluation
evaluateRule(rule: ConditionRule, entry: DailyEntry): { result: boolean; reason: string }
evaluateTaskConditions(task: CoreTask, entry: DailyEntry): TaskEvaluationResult

// Supplement management  
processSupplementsForEntry(supplements: SupplementTask[], entry: DailyEntry): SupplementTask[]
overrideSupplementStatus(supplements: SupplementTask[], id: string, forceActive: boolean): SupplementTask[]
loadAndProcessSupplementsForToday(date?: string): Promise<{supplements, evaluationResults, entry}>

// Utilities
describeConditionRules(rules: ConditionRule[]): string
validateConditionRules(rules: ConditionRule[]): {isValid: boolean, errors: string[]}
```

### Sample Condition Templates

```typescript
export const sampleConditionRules = {
  lowEnergy: [{ metric: 'energy', comparator: '<', value: 5 }],
  lowMood: [{ metric: 'mood', comparator: '<', value: 5 }],
  poorSleep: [{ metric: 'sleep', comparator: '<', value: 7 }],
  lowEnergyOrMood: [
    { metric: 'energy', comparator: '<', value: 5 },
    { metric: 'mood', comparator: '<', value: 5, logicOperator: 'OR' }
  ],
  noExercise: [{ metric: 'exercise', comparator: '=', value: false }]
};
```

This implementation provides a complete conditional supplement system that integrates seamlessly with the existing Daily Tracker architecture while adding powerful automation and user-friendly override capabilities.
