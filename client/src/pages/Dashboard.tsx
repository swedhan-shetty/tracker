import MetricCard from "@/components/MetricCard";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/EmptyState";
import { FileText, Flame, Smile, CheckCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  //todo: remove mock functionality
  const hasTodayEntry = false;
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
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-dashboard-title">Dashboard Overview</h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-date">{today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Entries" 
          value="0" 
          icon={FileText}
          iconColor="text-primary"
        />
        <MetricCard 
          title="Day Streak" 
          value="0" 
          icon={Flame}
          iconColor="text-chart-3"
        />
        <MetricCard 
          title="Average Mood" 
          value="0/10" 
          icon={Smile}
          iconColor="text-chart-2"
        />
        <MetricCard 
          title="Active Habits" 
          value="0" 
          icon={CheckCircle}
          iconColor="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4" data-testid="text-section-today-entry">Today's Entry</h2>
          {!hasTodayEntry ? (
            <EmptyState
              icon={Calendar}
              title="No entry for today"
              description="Start tracking your day by creating a new entry!"
              actionLabel="Create Entry"
              onAction={() => console.log('Create entry clicked')}
            />
          ) : null}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4" data-testid="text-section-tasks">Today's Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onToggle={(id, completed) => console.log(`Task ${id} completed: ${completed}`)}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
