import EmptyState from '../EmptyState';
import { Calendar } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <EmptyState
      icon={Calendar}
      title="No entry for today"
      description="Start tracking your day by creating a new entry!"
      actionLabel="Create Entry"
      onAction={() => console.log('Create entry clicked')}
    />
  );
}
