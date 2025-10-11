import AnalyticsChart from '../AnalyticsChart';

const mockData = [
  { date: 'Oct 5', value: 6 },
  { date: 'Oct 6', value: 7 },
  { date: 'Oct 7', value: 5 },
  { date: 'Oct 8', value: 8 },
  { date: 'Oct 9', value: 7 },
  { date: 'Oct 10', value: 9 },
  { date: 'Oct 11', value: 8 },
];

export default function AnalyticsChartExample() {
  return (
    <div className="max-w-4xl">
      <AnalyticsChart
        title="Mood Trend"
        data={mockData}
        color="hsl(var(--chart-1))"
      />
    </div>
  );
}
