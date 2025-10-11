import AnalyticsChart from "@/components/AnalyticsChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  //todo: remove mock functionality
  const mockMoodData = [
    { date: 'Oct 5', value: 6 },
    { date: 'Oct 6', value: 7 },
    { date: 'Oct 7', value: 5 },
    { date: 'Oct 8', value: 8 },
    { date: 'Oct 9', value: 7 },
    { date: 'Oct 10', value: 9 },
    { date: 'Oct 11', value: 8 },
  ];

  const mockEnergyData = [
    { date: 'Oct 5', value: 7 },
    { date: 'Oct 6', value: 6 },
    { date: 'Oct 7', value: 8 },
    { date: 'Oct 8', value: 7 },
    { date: 'Oct 9', value: 9 },
    { date: 'Oct 10', value: 8 },
    { date: 'Oct 11', value: 7 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-analytics-title">Analytics</h1>
          <p className="text-muted-foreground">Track your progress over time</p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-40" data-testid="select-time-range">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Mood Trend"
          data={mockMoodData}
          color="hsl(var(--chart-1))"
        />
        <AnalyticsChart
          title="Energy Levels"
          data={mockEnergyData}
          color="hsl(var(--chart-2))"
        />
      </div>
    </div>
  );
}
