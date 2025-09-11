import { DailyEntry, ConditionRule, CoreTask, TaskEvaluationResult } from '../types';

/**
 * Evaluate a single condition rule against daily entry metrics
 * @param rule - The condition rule to evaluate
 * @param entry - The daily entry containing metrics
 * @returns Object containing evaluation result and reason
 */
export function evaluateRule(rule: ConditionRule, entry: DailyEntry): { result: boolean; reason: string } {
  const { metric, comparator, value } = rule;
  
  // Get the actual value from the daily entry
  let actualValue: number | boolean;
  
  switch (metric) {
    case 'mood':
      actualValue = entry.mood;
      break;
    case 'energy':
      actualValue = entry.energy;
      break;
    case 'productivity':
      actualValue = entry.productivity;
      break;
    case 'sleep':
      actualValue = entry.sleep;
      break;
    case 'exercise':
      actualValue = entry.exercise;
      break;
    default:
      return { result: false, reason: `Unknown metric: ${metric}` };
  }

  // Perform comparison
  let result: boolean;
  let reason: string;
  
  switch (comparator) {
    case '<':
      result = (actualValue as number) < (value as number);
      reason = `${metric}(${actualValue}) < ${value} = ${result}`;
      break;
    case '>':
      result = (actualValue as number) > (value as number);
      reason = `${metric}(${actualValue}) > ${value} = ${result}`;
      break;
    case '=':
      result = actualValue === value;
      reason = `${metric}(${actualValue}) = ${value} = ${result}`;
      break;
    case '<=':
      result = (actualValue as number) <= (value as number);
      reason = `${metric}(${actualValue}) <= ${value} = ${result}`;
      break;
    case '>=':
      result = (actualValue as number) >= (value as number);
      reason = `${metric}(${actualValue}) >= ${value} = ${result}`;
      break;
    case '!=':
      result = actualValue !== value;
      reason = `${metric}(${actualValue}) != ${value} = ${result}`;
      break;
    default:
      result = false;
      reason = `Unknown comparator: ${comparator}`;
  }

  return { result, reason };
}

/**
 * Evaluate all condition rules for a task and determine if it should be active
 * @param task - The task containing condition rules
 * @param entry - The daily entry to evaluate against
 * @returns TaskEvaluationResult with detailed evaluation information
 */
export function evaluateTaskConditions(task: CoreTask, entry: DailyEntry): TaskEvaluationResult {
  const evaluationResult: TaskEvaluationResult = {
    taskId: task.id,
    isActive: task.defaultActive,
    isSkipped: false,
    evaluatedRules: [],
    finalReason: 'No conditions defined, using default active state'
  };

  // If no condition rules, use default active state
  if (!task.conditionRules || task.conditionRules.length === 0) {
    return evaluationResult;
  }

  // Evaluate each rule
  const ruleResults: boolean[] = [];
  
  for (const rule of task.conditionRules) {
    const { result, reason } = evaluateRule(rule, entry);
    
    evaluationResult.evaluatedRules.push({
      rule,
      result,
      reason
    });
    
    ruleResults.push(result);
  }

  // Determine final result based on logic operators
  let finalResult = ruleResults[0]; // Start with first rule result
  
  for (let i = 1; i < task.conditionRules.length; i++) {
    const rule = task.conditionRules[i];
    const ruleResult = ruleResults[i];
    
    if (rule.logicOperator === 'OR') {
      finalResult = finalResult || ruleResult;
    } else { // Default to AND if not specified
      finalResult = finalResult && ruleResult;
    }
  }

  // Set the final evaluation results
  evaluationResult.isActive = finalResult;
  evaluationResult.isSkipped = !finalResult;
  evaluationResult.finalReason = finalResult 
    ? 'Conditions met - task is active'
    : 'Conditions not met - task is skipped';

  return evaluationResult;
}

/**
 * Evaluate multiple tasks against a daily entry
 * @param tasks - Array of tasks to evaluate
 * @param entry - The daily entry to evaluate against
 * @returns Array of evaluation results
 */
export function evaluateMultipleTasks(tasks: CoreTask[], entry: DailyEntry): TaskEvaluationResult[] {
  return tasks.map(task => evaluateTaskConditions(task, entry));
}

/**
 * Update task active/inactive status based on evaluation results
 * @param tasks - Array of tasks to update
 * @param evaluationResults - Results from task evaluation
 * @returns Updated tasks array
 */
export function updateTasksFromEvaluation(tasks: CoreTask[], evaluationResults: TaskEvaluationResult[]): CoreTask[] {
  const resultMap = new Map(evaluationResults.map(result => [result.taskId, result]));
  
  return tasks.map(task => {
    const evalResult = resultMap.get(task.id);
    
    if (evalResult && !task.isOverridden) {
      return {
        ...task,
        isActive: evalResult.isActive,
        isSkipped: evalResult.isSkipped
      };
    }
    
    return task;
  });
}

/**
 * Create a user-friendly description of condition rules
 * @param rules - Array of condition rules
 * @returns Human-readable description
 */
export function describeConditionRules(rules: ConditionRule[]): string {
  if (!rules || rules.length === 0) {
    return 'No conditions';
  }

  const descriptions: string[] = [];
  
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    let description = `${rule.metric} ${rule.comparator} ${rule.value}`;
    
    // Add logic operator for subsequent rules
    if (i > 0 && rule.logicOperator) {
      description = `${rule.logicOperator} ${description}`;
    }
    
    descriptions.push(description);
  }
  
  return descriptions.join(' ');
}

/**
 * Validate condition rules for correctness
 * @param rules - Array of condition rules to validate
 * @returns Validation result with any error messages
 */
export function validateConditionRules(rules: ConditionRule[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!rules || rules.length === 0) {
    return { isValid: true, errors: [] };
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    
    // Validate metric
    const validMetrics = ['mood', 'energy', 'productivity', 'sleep', 'exercise'];
    if (!validMetrics.includes(rule.metric)) {
      errors.push(`Invalid metric '${rule.metric}' in rule ${i + 1}`);
    }
    
    // Validate comparator
    const validComparators = ['<', '>', '=', '<=', '>=', '!='];
    if (!validComparators.includes(rule.comparator)) {
      errors.push(`Invalid comparator '${rule.comparator}' in rule ${i + 1}`);
    }
    
    // Validate value type
    if (rule.metric === 'exercise') {
      if (typeof rule.value !== 'boolean') {
        errors.push(`Exercise metric requires boolean value in rule ${i + 1}`);
      }
    } else {
      if (typeof rule.value !== 'number') {
        errors.push(`Metric '${rule.metric}' requires numeric value in rule ${i + 1}`);
      }
    }
    
    // Validate logic operator (not for first rule)
    if (i > 0) {
      if (rule.logicOperator && !['AND', 'OR'].includes(rule.logicOperator)) {
        errors.push(`Invalid logic operator '${rule.logicOperator}' in rule ${i + 1}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create sample condition rules for common supplement scenarios
 */
export const sampleConditionRules = {
  lowEnergy: [
    { metric: 'energy' as const, comparator: '<' as const, value: 5 }
  ],
  lowMood: [
    { metric: 'mood' as const, comparator: '<' as const, value: 5 }
  ],
  poorSleep: [
    { metric: 'sleep' as const, comparator: '<' as const, value: 7 }
  ],
  lowEnergyOrMood: [
    { metric: 'energy' as const, comparator: '<' as const, value: 5 },
    { metric: 'mood' as const, comparator: '<' as const, value: 5, logicOperator: 'OR' as const }
  ],
  highEnergyAndGoodMood: [
    { metric: 'energy' as const, comparator: '>' as const, value: 7 },
    { metric: 'mood' as const, comparator: '>' as const, value: 7, logicOperator: 'AND' as const }
  ],
  noExercise: [
    { metric: 'exercise' as const, comparator: '=' as const, value: false }
  ]
};
