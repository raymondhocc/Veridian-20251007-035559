import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonData } from '@shared/types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
interface ComparisonRadarChartProps {
  data: ComparisonData[];
}
const platformColors = {
  Solana: 'hsl(var(--chart-1))',
  Ethereum: 'hsl(var(--chart-2))',
  BSC: 'hsl(var(--chart-3))',
};
export function ComparisonRadarChart({ data }: ComparisonRadarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Holistic Performance Overview</CardTitle>
        <CardDescription>Normalized scores (0-100) for key metrics. Higher is better.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Radar name="Solana" dataKey="Solana" stroke={platformColors.Solana} fill={platformColors.Solana} fillOpacity={0.6} />
              <Radar name="Ethereum" dataKey="Ethereum" stroke={platformColors.Ethereum} fill={platformColors.Ethereum} fillOpacity={0.6} />
              <Radar name="BSC" dataKey="BSC" stroke={platformColors.BSC} fill={platformColors.BSC} fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}