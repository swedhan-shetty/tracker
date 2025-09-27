import { useLocalStorage } from './useLocalStorage';
import { Supplement, SupplementFormData, Goal, Budget, MonthlySpending, Recommendation, SupplementStats } from '../types/supplements';
import { v4 as uuidv4 } from 'uuid';

// Initial data based on your prototype
const defaultGoals: Goal[] = [
  { id: 'fat_loss', name: 'Fat Loss', target: 'Lose 18kg fat', progress: '6kg lost', active: true },
  { id: 'muscle_gain', name: 'Muscle Gain', target: 'Maintain/gain muscle during cut', progress: 'Maintaining', active: true },
  { id: 'general_health', name: 'General Health', target: 'Optimize health markers', progress: 'On track', active: true },
  { id: 'hormone_optimization', name: 'Hormone Optimization', target: 'Optimize testosterone naturally', progress: 'In progress', active: false },
  { id: 'performance', name: 'Performance', target: 'Improve workout performance', progress: 'Gradual improvement', active: false },
];

const defaultBudget: Budget = {
  monthly: 3000,
  yearly: 36000,
};

const defaultSupplements: Supplement[] = [
  {
    id: '1',
    name: 'Vitamin D3',
    category: 'Essential Lifelong',
    dosage: '2000-4000 IU daily',
    megaDosing: 'Can go up to 10,000 IU short-term with monitoring',
    timing: 'With fat-containing meal for better absorption',
    costPerMonth: 300,
    costRange: '₹200-400',
    roi: 'Excellent - cheap, proven benefits for bone health, immune system',
    purpose: 'Bone health, immune support, hormone optimization',
    notes: 'One of the most cost-effective supplements. Get blood levels tested.',
    inCurrentStack: true,
    currentDosage: '3000 IU',
    startDate: '2024-07-15',
    goals: ['general_health', 'hormone_optimization'],
    evidenceRating: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Whey Protein Concentrate',
    category: 'Essential Lifelong',
    dosage: '20-30g per serving',
    megaDosing: 'Not applicable - use as needed for protein targets',
    timing: 'Post-workout or throughout day to meet protein goals',
    costPerMonth: 1600,
    costRange: '₹1200-2000',
    roi: 'Good - helps meet protein targets cost-effectively',
    purpose: 'Muscle building, convenient protein source',
    notes: 'Compared Indian market options for best protein-to-cost ratio',
    inCurrentStack: true,
    currentDosage: '25g daily',
    startDate: '2024-07-15',
    goals: ['muscle_gain', 'fat_loss'],
    evidenceRating: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ashwagandha',
    category: 'Goal-Specific',
    dosage: '300-600mg daily',
    megaDosing: 'Up to 1000mg for stress management',
    timing: 'Evening or before bed to avoid sedation',
    costPerMonth: 600,
    costRange: '₹400-800',
    roi: 'Moderate - good for stress and potentially testosterone',
    purpose: 'Stress reduction, sleep quality, testosterone support',
    notes: 'Researched for natural testosterone boosting',
    inCurrentStack: false,
    currentDosage: '',
    goals: ['hormone_optimization'],
    evidenceRating: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Zinc',
    category: 'Essential Lifelong',
    dosage: '10-15mg daily',
    megaDosing: 'Max 30mg, can interfere with copper absorption',
    timing: 'Empty stomach or 2 hours after meals',
    costPerMonth: 225,
    costRange: '₹150-300',
    roi: 'Good - cheap and important for immunity and hormones',
    purpose: 'Immune function, testosterone support, wound healing',
    notes: 'Compared options focusing on absorption and price',
    inCurrentStack: true,
    currentDosage: '12mg',
    startDate: '2024-08-01',
    goals: ['general_health', 'hormone_optimization'],
    evidenceRating: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useSupplementArchive() {
  const [supplements, setSupplements] = useLocalStorage<Supplement[]>('supplementArchive', defaultSupplements);
  const [goals, setGoals] = useLocalStorage<Goal[]>('supplementGoals', defaultGoals);
  const [budget, setBudget] = useLocalStorage<Budget>('supplementBudget', defaultBudget);
  const [monthlySpendingData] = useLocalStorage<MonthlySpending[]>('monthlySpending', [
    { month: 'Jul 2024', amount: 1900, supplements: 3 },
    { month: 'Aug 2024', amount: 2125, supplements: 3 },
    { month: 'Sep 2024', amount: 2125, supplements: 3 },
  ]);

  // Convert monthlySpending to the format expected by AnalyticsCharts
  const monthlySpending = monthlySpendingData.reduce((acc, item) => {
    acc[item.month] = item.amount;
    return acc;
  }, {} as Record<string, number>);

  const addSupplement = (data: SupplementFormData) => {
    const now = new Date().toISOString();
    const newSupplement: Supplement = {
      id: uuidv4(),
      ...data,
      goals: [], // Will be set when user selects goals
      evidenceRating: 3,
      createdAt: now,
      updatedAt: now,
    };
    setSupplements(prev => [...prev, newSupplement]);
    return newSupplement;
  };

  const updateSupplement = (id: string, data: Partial<Supplement>) => {
    setSupplements(prev =>
      prev.map(supplement =>
        supplement.id === id
          ? { ...supplement, ...data, updatedAt: new Date().toISOString() }
          : supplement
      )
    );
  };

  const deleteSupplement = (id: string) => {
    setSupplements(prev => prev.filter(supplement => supplement.id !== id));
  };

  const toggleCurrentStack = (id: string) => {
    setSupplements(prev =>
      prev.map(supplement =>
        supplement.id === id
          ? {
              ...supplement,
              inCurrentStack: !supplement.inCurrentStack,
              currentDosage: !supplement.inCurrentStack ? supplement.currentDosage : '',
              startDate: !supplement.inCurrentStack ? new Date().toISOString().split('T')[0] : supplement.startDate,
              updatedAt: new Date().toISOString(),
            }
          : supplement
      )
    );
  };

  const removeFromStack = (id: string) => {
    setSupplements(prev =>
      prev.map(supplement =>
        supplement.id === id
          ? {
              ...supplement,
              inCurrentStack: false,
              currentDosage: '',
              updatedAt: new Date().toISOString(),
            }
          : supplement
      )
    );
  };

  // Computed values
  const currentStack = supplements.filter(s => s.inCurrentStack);
  
  const supplementStats: SupplementStats = {
    totalSupplements: supplements.length,
    stackSupplements: currentStack.length,
    monthlyCost: currentStack.reduce((sum, s) => sum + (s.costPerMonth || 0), 0),
    budgetRemaining: budget.monthly - currentStack.reduce((sum, s) => sum + (s.costPerMonth || 0), 0),
  };

  const supplementsByCategory = supplements.reduce((acc, supplement) => {
    if (!acc[supplement.category]) {
      acc[supplement.category] = [];
    }
    acc[supplement.category].push(supplement);
    return acc;
  }, {} as Record<string, Supplement[]>);

  const currentStackByCategory = currentStack.reduce((acc, supplement) => {
    if (!acc[supplement.category]) {
      acc[supplement.category] = 0;
    }
    acc[supplement.category] += supplement.costPerMonth || 0;
    return acc;
  }, {} as Record<string, number>);

  // Generate recommendations based on goals and current stack
  const recommendations: Recommendation[] = [
    {
      supplement: 'L-Carnitine',
      reason: 'Currently pursuing fat loss goal - 6kg lost out of 18kg target',
      roi: 'Good ROI during active fat loss phases',
      budgetImpact: `Would increase monthly spend to ₹${supplementStats.monthlyCost + 1000} (${supplementStats.monthlyCost + 1000 <= budget.monthly ? 'still under budget' : 'over budget'})`,
      priority: 'High',
    },
    {
      supplement: 'Ashwagandha',
      reason: 'May support testosterone optimization and stress management',
      roi: 'Moderate - good for secondary goals',
      budgetImpact: `Would increase monthly spend to ₹${supplementStats.monthlyCost + 600}`,
      priority: 'Medium',
    },
  ];

  const searchSupplements = (query: string) => {
    if (!query.trim()) return supplements;
    
    const searchTerm = query.toLowerCase();
    return supplements.filter(supplement =>
      supplement.name.toLowerCase().includes(searchTerm) ||
      (supplement.purpose && supplement.purpose.toLowerCase().includes(searchTerm)) ||
      (supplement.notes && supplement.notes.toLowerCase().includes(searchTerm))
    );
  };

  const exportLibraryCSV = () => {
    const headers = ['id', 'name', 'category', 'dosage', 'timing', 'costPerMonth', 'purpose', 'roi', 'notes', 'inCurrentStack', 'currentDosage'];
    const csvContent = convertToCSV(supplements, headers);
    downloadCSV(csvContent, 'supplement-library.csv');
  };

  const exportStackCSV = () => {
    const headers = ['name', 'currentDosage', 'costPerMonth', 'timing', 'purpose', 'startDate'];
    const csvContent = convertToCSV(currentStack, headers);
    downloadCSV(csvContent, 'current-stack.csv');
  };

  const exportAnalyticsCSV = () => {
    const data = [
      ...monthlySpendingData.map(m => ({ type: 'Monthly Spending', ...m })),
      { type: 'Budget', monthly: budget.monthly, yearly: budget.yearly }
    ];
    const headers = ['type', 'month', 'amount', 'supplements', 'monthly', 'yearly'];
    const csvContent = convertToCSV(data, headers);
    downloadCSV(csvContent, 'analytics-data.csv');
  };

  return {
    // Data
    supplements,
    currentStack,
    goals,
    budget,
    monthlySpending,
    recommendations,
    supplementStats,
    supplementsByCategory,
    currentStackByCategory,
    
    // Actions
    addSupplement,
    updateSupplement,
    deleteSupplement,
    toggleCurrentStack,
    removeFromStack,
    searchSupplements,
    setBudget,
    setGoals,
    
    // Exports
    exportLibraryCSV,
    exportStackCSV,
    exportAnalyticsCSV,
  };
}

// Helper functions
function convertToCSV(data: any[], headers: string[]) {
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}