import { useLocalStorage } from './useLocalStorage';
import { Food, FoodLogItem, FoodPortion, NutritionInfo } from '../types/nutrition';
import { v4 as uuidv4 } from 'uuid';

function round(n: number, d = 1) { return Math.round(n * Math.pow(10, d)) / Math.pow(10, d); }

function portionToGrams(portion: FoodPortion, food: Food): { grams?: number; ml?: number } {
  if (portion.unit === 'g') return { grams: portion.quantity };
  if (portion.unit === 'ml') return { ml: portion.quantity };
  // Use mapping from food.defaultServing or density if available
  if (portion.grams) return { grams: portion.grams };
  if (portion.ml) return { ml: portion.ml };
  if (food.defaultServing) {
    const ds = food.defaultServing;
    if (ds.unit === portion.unit) {
      const factor = portion.quantity / ds.quantity;
      return { grams: ds.grams ? ds.grams * factor : undefined, ml: ds.ml ? ds.ml * factor : undefined };
    }
  }
  return {};
}

function computeTotals(food: Food, portion: FoodPortion): NutritionInfo {
  const { grams, ml } = portionToGrams(portion, food);
  const base = food.baseUnit;
  const ratio = base === 'g' ? (grams ?? (ml && food.density_g_per_ml ? ml * food.density_g_per_ml : 0)) / 100 : (ml ?? (grams && food.density_g_per_ml ? grams / food.density_g_per_ml : 0)) / 100;
  const r = Math.max(0, ratio || 0);
  const m = food.macrosPer100;
  return {
    calories: round(m.calories * r, 0),
    protein: round(m.protein * r, 1),
    carbs: round(m.carbs * r, 1),
    fat: round(m.fat * r, 1),
    fiber: m.fiber !== undefined ? round((m.fiber || 0) * r, 1) : undefined,
    sodium: m.sodium !== undefined ? Math.round((m.sodium || 0) * r) : undefined,
    sugar: m.sugar !== undefined ? round((m.sugar || 0) * r, 1) : undefined,
  };
}

export function useMacroLog() {
  const [log, setLog] = useLocalStorage<FoodLogItem[]>('macroLog', []);

  const addLogItem = (date: string, food: Food, portion: FoodPortion, customName?: string) => {
    const totals = computeTotals(food, portion);
    const item: FoodLogItem = {
      id: uuidv4(),
      date,
      foodId: food.id,
      customName,
      portion,
      totals,
    };
    setLog(prev => [...prev, item]);
  };

  const deleteLogItem = (id: string) => setLog(prev => prev.filter(i => i.id !== id));

  const getByDate = (date: string) => log.filter(i => i.date === date);

  const sumDay = (date: string): NutritionInfo => {
    const items = getByDate(date);
    return items.reduce<NutritionInfo>((acc, i) => ({
      calories: (acc.calories || 0) + (i.totals.calories || 0),
      protein: (acc.protein || 0) + (i.totals.protein || 0),
      carbs: (acc.carbs || 0) + (i.totals.carbs || 0),
      fat: (acc.fat || 0) + (i.totals.fat || 0),
      fiber: acc.fiber !== undefined || i.totals.fiber !== undefined ? ((acc.fiber || 0) + (i.totals.fiber || 0)) : undefined,
      sodium: acc.sodium !== undefined || i.totals.sodium !== undefined ? ((acc.sodium || 0) + (i.totals.sodium || 0)) : undefined,
      sugar: acc.sugar !== undefined || i.totals.sugar !== undefined ? ((acc.sugar || 0) + (i.totals.sugar || 0)) : undefined,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return { log, addLogItem, deleteLogItem, getByDate, sumDay };
}
