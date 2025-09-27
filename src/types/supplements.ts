export interface Supplement {
  id: string;
  name: string;
  category: SupplementCategory;
  dosage?: string;
  megaDosing?: string;
  timing?: string;
  costPerMonth?: number;
  costRange?: string;
  roi?: string;
  purpose?: string;
  notes?: string;
  inCurrentStack: boolean;
  currentDosage?: string;
  startDate?: string;
  goals: Goal['id'][];
  evidenceRating: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  updatedAt: string;
}

export type SupplementCategory = 
  | 'Essential Lifelong'
  | 'Goal-Specific'
  | 'Uncertain/Trial'
  | 'Wishlist';

export interface Goal {
  id: string;
  name: string;
  target: string;
  progress: string;
  active: boolean;
}

export interface MonthlySpending {
  month: string;
  amount: number;
  supplements: number;
}

export interface Budget {
  monthly: number;
  yearly: number;
}

export interface Recommendation {
  supplement: string;
  reason: string;
  roi: string;
  budgetImpact: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SupplementFormData {
  name: string;
  category: SupplementCategory;
  dosage?: string;
  timing?: string;
  costPerMonth?: number;
  purpose?: string;
  notes?: string;
  inCurrentStack: boolean;
  currentDosage?: string;
}

export interface CategoryColors {
  'Essential Lifelong': string;
  'Goal-Specific': string;
  'Uncertain/Trial': string;
  'Wishlist': string;
}

export interface SupplementStats {
  totalSupplements: number;
  stackSupplements: number;
  monthlyCost: number;
  budgetRemaining: number;
  adherenceRate?: number;
}
