import TaskCard from '../TaskCard';

export default function TaskCardExample() {
  return (
    <div className="space-y-3 max-w-2xl">
      <TaskCard
        id="1"
        title="Complete workout routine"
        description="30 minutes cardio + strength training"
        priority="high"
        dueDate="Today"
        onToggle={(id, completed) => console.log(`Task ${id} completed: ${completed}`)}
      />
      <TaskCard
        id="2"
        title="Track daily macros"
        priority="medium"
        dueDate="Today"
      />
      <TaskCard
        id="3"
        title="Read 20 pages"
        description="Continue with current book"
        priority="low"
        completed={true}
      />
    </div>
  );
}
