import { NutritionInfo, Food } from '../types/nutrition';
import { v4 as uuidv4 } from 'uuid';

// USDA FoodData Central API - free tier allows 1000 requests/hour
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = 'DEMO_KEY'; // Use DEMO_KEY for testing, replace with actual key for production

export interface USDAFood {
  fdcId: number;
  description: string;
  brandName?: string;
  foodNutrients: {
    nutrientId: number;
    value: number;
  }[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface ExternalFoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  description: string;
  macros: NutritionInfo;
  servingInfo?: string;
}

// USDA Nutrient IDs mapping
const NUTRIENT_MAPPING = {
  1008: 'calories',    // Energy (kcal)
  1003: 'protein',     // Protein (g)
  1005: 'carbs',       // Carbohydrates (g)  
  1004: 'fat',         // Total lipid (fat) (g)
  1079: 'fiber',       // Fiber, total dietary (g)
  1093: 'sodium',      // Sodium (mg)
  2000: 'sugar',       // Sugars, total (g)
} as const;

function extractNutrients(foodNutrients: USDAFood['foodNutrients']): NutritionInfo {
  const nutrients: any = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  foodNutrients.forEach(nutrient => {
    const key = NUTRIENT_MAPPING[nutrient.nutrientId as keyof typeof NUTRIENT_MAPPING];
    if (key && nutrient.value) {
      nutrients[key] = Math.round(nutrient.value * 10) / 10; // Round to 1 decimal
    }
  });

  return nutrients;
}

export async function searchExternalFoods(query: string): Promise<ExternalFoodSearchResult[]> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR Legacy,Branded&pageSize=10&api_key=${USDA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.foods?.map((food: USDAFood) => {
      const macros = extractNutrients(food.foodNutrients);
      
      return {
        id: `usda_${food.fdcId}`,
        name: food.description,
        brand: food.brandName,
        description: food.description,
        macros,
        servingInfo: food.servingSize && food.servingSizeUnit 
          ? `${food.servingSize} ${food.servingSizeUnit}`
          : undefined,
      };
    }) || [];
  } catch (error) {
    console.error('Error searching external foods:', error);
    return [];
  }
}

export function convertExternalToFood(external: ExternalFoodSearchResult): Food {
  return {
    id: uuidv4(),
    name: external.name,
    brand: external.brand,
    category: 'External',
    baseUnit: 'g',
    macrosPer100: external.macros,
    notes: `From USDA: ${external.description}`,
    defaultServing: {
      quantity: 100,
      unit: 'g',
      grams: 100,
    },
  };
}

// Fallback mock data for when API is unavailable or over rate limit
export function getMockSearchResults(query: string): ExternalFoodSearchResult[] {
  const mockFoods = [
    {
      id: 'mock_shawarma',
      name: 'Chicken Shawarma',
      description: 'Middle Eastern chicken shawarma with vegetables and sauce',
      macros: { calories: 195, protein: 18, carbs: 12, fat: 9, fiber: 2 },
      servingInfo: '200g serving',
    },
    {
      id: 'mock_pizza',
      name: 'Pizza Margherita',
      description: 'Traditional Italian pizza with tomato, mozzarella, and basil',
      macros: { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2 },
      servingInfo: '100g slice',
    },
    {
      id: 'mock_burger',
      name: 'Beef Burger',
      description: 'Ground beef burger patty with bun and vegetables',
      macros: { calories: 295, protein: 17, carbs: 24, fat: 15, fiber: 2 },
      servingInfo: '150g burger',
    },
  ];

  return mockFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase()) ||
    food.description.toLowerCase().includes(query.toLowerCase())
  );
}
