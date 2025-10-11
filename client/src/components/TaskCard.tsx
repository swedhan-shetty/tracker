import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  onToggle?: (id: string, completed: boolean) => void;
}

const priorityColors = {
  low: "border-l-chart-2",
  medium: "border-l-chart-3",
  high: "border-l-destructive",
};

export default function TaskCard({ 
  id, 
  title, 
  description, 
  completed = false, 
  dueDate,
  priority = "medium",
  onToggle 
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleToggle = (checked: boolean) => {
    setIsCompleted(checked);
    onToggle?.(id, checked);
  };

  return (
    <Card 
      className={`p-4 border-l-4 ${priorityColors[priority]} hover-elevate cursor-pointer transition-all`}
      data-testid={`card-task-${id}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={isCompleted}
          onCheckedChange={handleToggle}
          className="mt-1"
          data-testid={`checkbox-task-${id}`}
        />
        <div className="flex-1 min-w-0">
          <h4 
            className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
            data-testid={`text-task-title-${id}`}
          >
            {title}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1" data-testid={`text-task-description-${id}`}>
              {description}
            </p>
          )}
          {dueDate && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span data-testid={`text-task-due-${id}`}>{dueDate}</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Card>
  );
}
