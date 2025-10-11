import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Macros() {
  //todo: remove mock functionality
  const macros = {
    protein: { current: 0, target: 150, unit: 'g' },
    carbs: { current: 0, target: 200, unit: 'g' },
    fats: { current: 0, target: 60, unit: 'g' },
    calories: { current: 0, target: 2000, unit: 'kcal' }
  };

  const getMacroPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-macros-title">Macros</h1>
          <p className="text-muted-foreground">Track your daily nutrition</p>
        </div>
        <Button data-testid="button-log-meal">
          <Plus className="w-4 h-4 mr-2" />
          Log Meal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Protein</span>
              <span className="text-sm font-mono font-medium" data-testid="text-protein-value">
                {macros.protein.current}/{macros.protein.target}{macros.protein.unit}
              </span>
            </div>
            <Progress value={getMacroPercentage(macros.protein.current, macros.protein.target)} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Carbs</span>
              <span className="text-sm font-mono font-medium" data-testid="text-carbs-value">
                {macros.carbs.current}/{macros.carbs.target}{macros.carbs.unit}
              </span>
            </div>
            <Progress value={getMacroPercentage(macros.carbs.current, macros.carbs.target)} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fats</span>
              <span className="text-sm font-mono font-medium" data-testid="text-fats-value">
                {macros.fats.current}/{macros.fats.target}{macros.fats.unit}
              </span>
            </div>
            <Progress value={getMacroPercentage(macros.fats.current, macros.fats.target)} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Calories</span>
              <span className="text-sm font-mono font-medium" data-testid="text-calories-value">
                {macros.calories.current}/{macros.calories.target}{macros.calories.unit}
              </span>
            </div>
            <Progress value={getMacroPercentage(macros.calories.current, macros.calories.target)} className="h-2" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>No meals logged today</p>
        </div>
      </Card>
    </div>
  );
}
