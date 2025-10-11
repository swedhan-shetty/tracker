import ArchiveCard from '../ArchiveCard';

export default function ArchiveCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <ArchiveCard
        id="1"
        title="Atomic Habits"
        subtitle="James Clear"
        tags={["Self-Help", "Productivity"]}
        onClick={() => console.log('Card clicked')}
      />
      <ArchiveCard
        id="2"
        title="Vitamin D3"
        subtitle="Daily supplement"
        tags={["Morning", "Health"]}
      />
      <ArchiveCard
        id="3"
        title="Push Day Workout"
        subtitle="45 minutes"
        tags={["Strength", "Upper Body"]}
      />
    </div>
  );
}
