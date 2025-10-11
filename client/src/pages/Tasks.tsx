import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Tasks() {
  //todo: remove mock functionality
  const tasks = [
    {
      id: "1",
      title: "Complete workout routine",
      description: "30 minutes cardio + strength training",
      priority: "high" as const,
      dueDate: "Today"
    },
    {
      id: "2",
      title: "Track daily macros",
      priority: "medium" as const,
      dueDate: "Today"
    },
    {
      id: "3",
      title: "Read 20 pages",
      description: "Continue with current book",
      priority: "low" as const,
      completed: true,
      dueDate: "Today"
    },
    {
      id: "4",
      title: "Plan weekly meals",
      priority: "medium" as const,
      dueDate: "Tomorrow"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-tasks-title">Tasks</h1>
          <p className="text-muted-foreground">Manage your daily tasks and goals</p>
        </div>
        <Button data-testid="button-add-task">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            onToggle={(id, completed) => console.log(`Task ${id} completed: ${completed}`)}
          />
        ))}
      </div>
    </div>
  );
}
