import { useLocalStorage } from './useLocalStorage';
import { Food } from '../types/nutrition';
import { useMemo } from 'react';

export function useFoods() {
  const [foods, setFoods] = useLocalStorage<Food[]>('myFoods', []);

  const addFood = (food: Food) => setFoods(prev => [...prev, food]);
  const updateFood = (food: Food) => setFoods(prev => prev.map(f => (f.id === food.id ? food : f)));
  const deleteFood = (id: string) => setFoods(prev => prev.filter(f => f.id !== id));

  const byId = useMemo(() => new Map(foods.map(f => [f.id, f])), [foods]);

  return { foods, addFood, updateFood, deleteFood, byId };
}
