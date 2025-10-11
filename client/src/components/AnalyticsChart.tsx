import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  dataKey?: string;
  color?: string;
}

export default function AnalyticsChart({ 
  title, 
  data, 
  dataKey = "value",
  color = "hsl(var(--primary))" 
}: AnalyticsChartProps) {
  return (
    <Card className="p-6" data-testid={`card-chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="text-lg font-semibold mb-4" data-testid={`text-chart-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem"
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
