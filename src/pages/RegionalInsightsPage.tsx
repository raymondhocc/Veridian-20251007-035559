import { useEffect } from 'react';
import { useRegionalStore } from '@/hooks/useRegionalStore';
import { RegionalMap } from '@/components/dashboard/RegionalMap';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RegionalMetric } from '@shared/types';
export function RegionalInsightsPage() {
  const regionalData = useRegionalStore((state) => state.regionalData);
  const isLoading = useRegionalStore((state) => state.isLoading);
  const error = useRegionalStore((state) => state.error);
  const fetchRegionalData = useRegionalStore((state) => state.fetchRegionalData);
  useEffect(() => {
    fetchRegionalData();
  }, [fetchRegionalData]);
  if (isLoading) {
    return <RegionalSkeleton />;
  }
  if (error) {
    return <RegionalError error={error} onRetry={fetchRegionalData} />;
  }
  if (!regionalData || regionalData.length === 0) {
    return <RegionalEmpty onFetch={fetchRegionalData} />;
  }
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <RegionalMap data={regionalData} />
      <RegionalDataTable data={regionalData} />
    </div>
  );
}
function RegionalDataTable({ data }: { data: RegionalMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Data Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Payment Volume</TableHead>
              <TableHead className="text-right">Avg. Txn Speed (ms)</TableHead>
              <TableHead className="text-right">Avg. Gas Fee (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((metric) => (
              <TableRow key={metric.countryCode}>
                <TableCell className="font-medium">{metric.countryName}</TableCell>
                <TableCell className="text-right">${(metric.paymentVolume / 1e6).toFixed(2)}M</TableCell>
                <TableCell className="text-right">{metric.transactionSpeed.toFixed(0)}</TableCell>
                <TableCell className="text-right">${metric.gasFee.toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function RegionalSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <Skeleton className="h-96" />
      <Skeleton className="h-64" />
    </div>
  );
}
function RegionalError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Failed to Load Regional Data</h2>
      <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
}
function RegionalEmpty({ onFetch }: { onFetch: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-semibold mb-2">No Regional Data Available</h2>
      <p className="text-muted-foreground mb-4">There is no geographic data to display.</p>
      <Button onClick={onFetch}>Fetch Data</Button>
    </div>
  );
}