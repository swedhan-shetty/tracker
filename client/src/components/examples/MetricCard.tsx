import MetricCard from '../MetricCard';
import { FileText, Flame, Smile, CheckCircle } from 'lucide-react';

export default function MetricCardExample() {
  return (
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
  );
}
