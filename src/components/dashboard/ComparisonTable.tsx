import { useState, useMemo } from 'react';
import { PlatformData } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
type SortKey = 'platform' | 'paymentVolume' | 'transactionSpeed' | 'gasFees' | 'etfPrice';
type SortDirection = 'asc' | 'desc';
interface ComparisonTableProps {
  data: PlatformData[];
}
const parseValue = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) * (value.includes('B') ? 1e9 : 1);
};
export function ComparisonTable({ data }: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('paymentVolume');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      let valA, valB;
      if (sortKey === 'platform') {
        valA = a.platform;
        valB = b.platform;
      } else {
        valA = parseValue(a.metrics[sortKey].value);
        valB = parseValue(b.metrics[sortKey].value);
      }
      if (valA < valB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortKey, sortDirection]);
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  const SortableHeader = ({ sortKey: key, children }: { sortKey: SortKey; children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(key)} className="px-2 py-1 h-auto -ml-2">
        {children}
        {sortKey === key && (
          sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </TableHead>
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Metrics Comparison</CardTitle>
        <CardDescription>Side-by-side comparison of key performance indicators.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader sortKey="platform">Platform</SortableHeader>
              <SortableHeader sortKey="paymentVolume">Payment Volume</SortableHeader>
              <SortableHeader sortKey="transactionSpeed">Txn Speed (ms)</SortableHeader>
              <SortableHeader sortKey="gasFees">Gas Fees (USD)</SortableHeader>
              <SortableHeader sortKey="etfPrice">ETF Price (USD)</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map(({ platform, metrics }) => (
              <TableRow key={platform} className="hover:bg-muted/50">
                <TableCell className="font-medium">{platform}</TableCell>
                <TableCell>{metrics.paymentVolume.value}</TableCell>
                <TableCell>{metrics.transactionSpeed.value}</TableCell>
                <TableCell>{metrics.gasFees.value}</TableCell>
                <TableCell>{metrics.etfPrice.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}