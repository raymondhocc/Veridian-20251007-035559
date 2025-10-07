import { useEffect, useMemo } from 'react';
import { useComparisonStore } from '@/hooks/useComparisonStore';
import { ComparisonTable } from '@/components/dashboard/ComparisonTable';
import { ComparisonRadarChart } from '@/components/dashboard/ComparisonRadarChart';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlatformData, ComparisonData, Platform } from '@shared/types';
const parseValue = (value: string): number => {
  const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  if (value.includes('B')) return num * 1e9;
  if (value.includes('M')) return num * 1e6;
  if (value.includes('k')) return num * 1e3;
  return num;
};
const normalizeData = (data: PlatformData[]): ComparisonData[] => {
  if (!data || data.length === 0) return [];
  const metrics = ['paymentVolume', 'transactionSpeed', 'gasFees', 'etfPrice'] as const;
  const higherIsBetter = {
    paymentVolume: true,
    transactionSpeed: false, // lower ms is better
    gasFees: false, // lower fee is better
    etfPrice: true,
  };
  return metrics.map(metricKey => {
    const values = data.map(d => parseValue(d.metrics[metricKey].value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const radarEntry: ComparisonData = {
      metric: data[0].metrics[metricKey].label.replace(/Avg. | Volume| Price/g, ''),
      Solana: 0,
      Ethereum: 0,
      BSC: 0,
    };
    data.forEach(d => {
      const platform = d.platform as Platform;
      const rawValue = parseValue(d.metrics[metricKey].value);
      let score = 0;
      if (max - min !== 0) {
        score = higherIsBetter[metricKey]
          ? ((rawValue - min) / (max - min)) * 100
          : ((max - rawValue) / (max - min)) * 100;
      }
      radarEntry[platform] = Math.round(score);
    });
    return radarEntry;
  });
};
export function ComparativeAnalysisPage() {
  const allMetrics = useComparisonStore((state) => state.allMetrics);
  const isLoading = useComparisonStore((state) => state.isLoading);
  const error = useComparisonStore((state) => state.error);
  const fetchMetrics = useComparisonStore((state) => state.fetchMetrics);
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);
  const radarChartData = useMemo(() => normalizeData(allMetrics), [allMetrics]);
  if (isLoading) {
    return <ComparisonSkeleton />;
  }
  if (error) {
    return <ComparisonError error={error} onRetry={fetchMetrics} />;
  }
  if (!allMetrics || allMetrics.length === 0) {
    return <ComparisonEmpty onFetch={fetchMetrics} />;
  }
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <ComparisonRadarChart data={radarChartData} />
      <ComparisonTable data={allMetrics} />
    </div>
  );
}
function ComparisonSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <Skeleton className="h-[450px]" />
      <Skeleton className="h-64" />
    </div>
  );
}
function ComparisonError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Failed to Load Comparison Data</h2>
      <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
}
function ComparisonEmpty({ onFetch }: { onFetch: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-semibold mb-2">No Comparison Data Available</h2>
      <p className="text-muted-foreground mb-4">There is no data to display for comparison.</p>
      <Button onClick={onFetch}>Fetch Data</Button>
    </div>
  );
}