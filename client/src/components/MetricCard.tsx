import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-primary",
  subtitle 
}: MetricCardProps) {
  return (
    <Card className="p-6" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-metric-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </p>
          <p className="text-3xl font-semibold font-mono" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2" data-testid={`text-metric-subtitle-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-md bg-accent ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
