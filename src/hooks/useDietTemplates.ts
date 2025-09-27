import { useLocalStorage } from './useLocalStorage';
import { DietTemplate, MacroPreset, NutritionInfo } from '../types/nutrition';
import { v4 as uuidv4 } from 'uuid';

// Built-in macro presets for quick template creation
export const macroPresets: MacroPreset[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Well-rounded macro distribution for maintenance or general health',
    macroRatios: {
      proteinPerKg: 1.6,
      carbsPercent: 40,
      fatPercent: 30,
    },
    category: 'maintain',
  },
  {
    id: 'high-protein',
    name: 'High Protein',
    description: 'Higher protein for muscle building or retention during cuts',
    macroRatios: {
      proteinPerKg: 2.2,
      carbsPercent: 35,
      fatPercent: 25,
    },
    category: 'cut',
  },
  {
    id: 'low-carb',
    name: 'Low Carb',
    description: 'Reduced carbohydrates, higher fat for fat loss',
    macroRatios: {
      proteinPerKg: 2.0,
      carbsPercent: 20,
      fatPercent: 45,
    },
    category: 'cut',
  },
  {
    id: 'athletic',
    name: 'Athletic Performance',
    description: 'Higher carbs for training performance',
    macroRatios: {
      proteinPerKg: 1.8,
      carbsPercent: 50,
      fatPercent: 25,
    },
    category: 'athletic',
  },
];

// Utility function to calculate macros from preset and body weight
export function calculateMacrosFromPreset(
  preset: MacroPreset,
  totalCalories: number,
  bodyWeightKg: number
): NutritionInfo {
  const protein = preset.macroRatios.proteinPerKg * bodyWeightKg;
  const proteinCalories = protein * 4;
  
  const remainingCalories = totalCalories - proteinCalories;
  const carbsCalories = remainingCalories * (preset.macroRatios.carbsPercent / 100);
  const fatCalories = remainingCalories * (preset.macroRatios.fatPercent / 100);
  
  const carbs = carbsCalories / 4;
  const fat = fatCalories / 9;
  
  // Calculate fiber based on carb intake (rough estimate of 14g per 1000 calories)
  const fiber = Math.round((totalCalories / 1000) * 14);
  
  return {
    calories: totalCalories,
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber,
  };
}

export function useDietTemplates() {
  const [templates, setTemplates] = useLocalStorage<DietTemplate[]>('dietTemplates', []);
  const [activeTemplateId, setActiveTemplateId] = useLocalStorage<string | null>('activeDietTemplate', null);

  const addTemplate = (templateData: Omit<DietTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTemplate: DietTemplate = {
      ...templateData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<DietTemplate>) => {
    const updatedTemplate = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    setTemplates(prev =>
      prev.map(template =>
        template.id === id ? { ...template, ...updatedTemplate } : template
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    
    // If deleted template was active, clear active template
    if (activeTemplateId === id) {
      setActiveTemplateId(null);
    }
  };

  const duplicateTemplate = (id: string, newName?: string) => {
    const originalTemplate = templates.find(t => t.id === id);
    if (!originalTemplate) return null;

    const now = new Date().toISOString();
    const duplicatedTemplate: DietTemplate = {
      ...originalTemplate,
      id: uuidv4(),
      name: newName || `${originalTemplate.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      isActive: false, // New template starts inactive
    };

    setTemplates(prev => [...prev, duplicatedTemplate]);
    return duplicatedTemplate;
  };

  const setActiveTemplate = (id: string | null) => {
    // Deactivate all templates first
    setTemplates(prev =>
      prev.map(template => ({ ...template, isActive: false }))
    );
    
    if (id) {
      // Activate selected template
      setTemplates(prev =>
        prev.map(template =>
          template.id === id ? { ...template, isActive: true } : template
        )
      );
    }
    
    setActiveTemplateId(id);
  };

  // Get active template for a specific date
  const getActiveTemplateForDate = (date: string): DietTemplate | null => {
    if (!activeTemplateId) return null;
    
    const template = templates.find(t => t.id === activeTemplateId);
    if (!template) return null;

    // Check if date falls within template period
    const targetDate = new Date(date);
    const startDate = new Date(template.period.startDate);
    const endDate = template.period.endDate ? new Date(template.period.endDate) : null;

    if (targetDate < startDate) return null;
    if (endDate && targetDate > endDate) return null;

    return template;
  };

  // Get current macro targets based on active template
  const getCurrentTargets = (date: string = new Date().toISOString().split('T')[0]): NutritionInfo | null => {
    const activeTemplate = getActiveTemplateForDate(date);
    return activeTemplate?.macroTargets || null;
  };

  // Find templates that overlap with a date range
  const getTemplatesInRange = (startDate: string, endDate: string): DietTemplate[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return templates.filter(template => {
      const templateStart = new Date(template.period.startDate);
      const templateEnd = template.period.endDate ? new Date(template.period.endDate) : new Date('2099-12-31');
      
      // Check for overlap
      return templateStart <= end && templateEnd >= start;
    });
  };

  // Create template from preset
  const createFromPreset = (
    preset: MacroPreset,
    templateName: string,
    totalCalories: number,
    bodyWeightKg: number,
    startDate: string,
    endDate?: string
  ): DietTemplate => {
    const macroTargets = calculateMacrosFromPreset(preset, totalCalories, bodyWeightKg);
    
    return addTemplate({
      name: templateName,
      description: preset.description,
      period: { startDate, endDate },
      macroTargets,
      color: getColorByCategory(preset.category),
      tags: [preset.category, preset.name.toLowerCase().replace(/\s+/g, '-')],
    });
  };

  const activeTemplate = activeTemplateId ? templates.find(t => t.id === activeTemplateId) : null;

  return {
    templates,
    activeTemplate,
    activeTemplateId,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    setActiveTemplate,
    getActiveTemplateForDate,
    getCurrentTargets,
    getTemplatesInRange,
    createFromPreset,
    macroPresets,
  };
}

// Helper function to get color by category
function getColorByCategory(category: string): string {
  const colorMap: Record<string, string> = {
    cut: '#e74c3c',      // Red for cutting
    bulk: '#2ecc71',     // Green for bulking  
    maintain: '#3498db', // Blue for maintenance
    athletic: '#f39c12', // Orange for athletic
    custom: '#9b59b6',   // Purple for custom
  };
  
  return colorMap[category] || colorMap.custom;
}
