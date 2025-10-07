import { useEffect } from 'react';
import { useMetricsStore } from '@/hooks/useMetricsStore';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Zap, Gauge, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
const icons = {
  paymentVolume: DollarSign,
  transactionSpeed: Zap,
  gasFees: Gauge,
  etfPrice: TrendingUp,
};
export function DashboardOverviewPage() {
  const metrics = useMetricsStore((state) => state.metrics);
  const isLoading = useMetricsStore((state) => state.isLoading);
  const error = useMetricsStore((state) => state.error);
  const fetchMetrics = useMetricsStore((state) => state.fetchMetrics);
  useEffect(() => {
    // Fetch initial metrics if they haven't been loaded yet
    if (!metrics && !isLoading && !error) {
      fetchMetrics();
    }
  }, [fetchMetrics, metrics, isLoading, error]);
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (error) {
    return <DashboardError error={error} onRetry={fetchMetrics} />;
  }
  if (!metrics) {
    return <DashboardEmpty onFetch={fetchMetrics} />;
  }
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard metric={metrics.metrics.paymentVolume} icon={icons.paymentVolume} />
        <MetricCard metric={metrics.metrics.transactionSpeed} icon={icons.transactionSpeed} />
        <MetricCard metric={metrics.metrics.gasFees} icon={icons.gasFees} />
        <MetricCard metric={metrics.metrics.etfPrice} icon={icons.etfPrice} />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ChartCard
          title="Cross-Border Payment Volume"
          description="Total volume of cross-border payments processed."
          data={metrics.metrics.crossBorderVolume}
        />
        <ChartCard
          title="Gas Fee Trends"
          description="Average transaction fees over time."
          data={metrics.metrics.gasFeeTrend}
        />
      </div>
    </div>
  );
}
function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Skeleton className="h-[450px]" />
        <Skeleton className="h-[450px]" />
      </div>
    </div>
  );
}
function DashboardError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Failed to Load Data</h2>
      <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
}
function DashboardEmpty({ onFetch }: { onFetch: () => void }) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
        <p className="text-muted-foreground mb-4">There is no data to display for the selected platform.</p>
        <Button onClick={onFetch}>Fetch Data</Button>
      </div>
    );
  }