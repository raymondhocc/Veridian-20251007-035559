import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metric } from '@shared/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
interface MetricCardProps {
  metric: Metric;
  icon: React.ElementType;
}
export function MetricCard({ metric, icon: Icon }: MetricCardProps) {
  const isIncrease = metric.changeType === 'increase';
  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1 duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold cal-sans">{metric.value}</div>
            <p className={cn("text-xs flex items-center", isIncrease ? "text-green-500" : "text-red-500")}>
              {isIncrease ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {metric.change} vs last month
            </p>
          </div>
          <div className="h-16 w-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metric.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={isIncrease ? "colorIncrease" : "colorDecrease"} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isIncrease ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isIncrease ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isIncrease ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#${isIncrease ? "colorIncrease" : "colorDecrease"})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}