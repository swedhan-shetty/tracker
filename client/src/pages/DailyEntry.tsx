import DailyEntryForm from "@/components/DailyEntryForm";

export default function DailyEntry() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-entry-title">Daily Entry</h1>
        <p className="text-muted-foreground" data-testid="text-entry-subtitle">
          Track your day and reflect on your progress
        </p>
      </div>
      <DailyEntryForm />
    </div>
  );
}
