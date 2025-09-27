export type Unit = 'g' | 'ml' | 'piece' | 'scoop' | 'cup' | 'tbsp' | 'tsp';

export interface NutritionInfo {
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
  sodium?: number; // mg
  sugar?: number; // g
}

// Canonical representation is per 100g or 100ml to simplify conversions
export interface Food {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  // Base measurement for macros; assume 100g or 100ml canonical
  baseUnit: 'g' | 'ml';
  macrosPer100: NutritionInfo;
  // Default serving suggestion for UI convenience
  defaultServing?: {
    quantity: number;
    unit: Unit;
    grams?: number; // if unit != g/ml, map to grams
    ml?: number;    // if unit != g/ml, map to ml
  };
  // Optional density mapping for conversions (ml -> g)
  density_g_per_ml?: number;
  notes?: string;
  isFavorite?: boolean;
}

export interface FoodPortion {
  quantity: number;
  unit: Unit;
  grams?: number;
  ml?: number;
}

export interface FoodLogItem {
  id: string;
  date: string; // YYYY-MM-DD
  foodId: string;
  customName?: string; // allow logging custom/one-off foods
  portion: FoodPortion;
  // Computed totals at time of logging (so history remains stable if food definitions change)
  totals: NutritionInfo;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
}

export interface MacroDaySummary {
  date: string; // YYYY-MM-DD
  totals: NutritionInfo;
}

export interface DietTemplate {
  id: string;
  name: string;
  description?: string;
  period: {
    startDate: string;
    endDate?: string;
  };
  macroTargets: NutritionInfo;
  color: string;
  tags?: string[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MacroPreset {
  id: string;
  name: string;
  description: string;
  macroRatios: {
    proteinPerKg: number;
    carbsPercent: number;
    fatPercent: number;
  };
  category: string;
}
