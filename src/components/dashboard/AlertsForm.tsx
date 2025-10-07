import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertConfiguration, AlertChannel, AlertCondition, AlertMetricType, Platform } from '@shared/types';
import { Bell, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAlertsStore } from '@/hooks/useAlertsStore';
import { Skeleton } from '../ui/skeleton';
export function AlertsForm() {
  const {
    configurations,
    isLoading,
    isSaving,
    error,
    fetchConfigurations,
    saveConfigurations,
    addAlert,
    removeAlert,
    updateAlert,
    setConfigurations,
  } = useAlertsStore();
  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);
  if (isLoading) {
    return <AlertsFormSkeleton />;
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">Failed to load alerts</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{error}</p>
        <Button onClick={fetchConfigurations}>Try Again</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {configurations.map((alert, index) => (
        <Card key={alert.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Alert Configuration #{index + 1}</CardTitle>
              <CardDescription>Set conditions to trigger notifications.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={alert.isEnabled}
                onCheckedChange={(checked) => updateAlert(alert.id, { isEnabled: checked })}
              />
              <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={alert.platform}
                  onValueChange={(value: Platform) => updateAlert(alert.id, { platform: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="BSC">Binance Smart Chain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Metric</Label>
                <Select
                  value={alert.metric}
                  onValueChange={(value: AlertMetricType) => updateAlert(alert.id, { metric: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paymentVolume">Payment Volume</SelectItem>
                    <SelectItem value="transactionSpeed">Transaction Speed</SelectItem>
                    <SelectItem value="gasFees">Gas Fees</SelectItem>
                    <SelectItem value="etfPrice">ETF Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={alert.condition}
                  onValueChange={(value: AlertCondition) => updateAlert(alert.id, { condition: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Is Above</SelectItem>
                    <SelectItem value="below">Is Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Threshold</Label>
                <Input
                  type="number"
                  value={alert.threshold}
                  onChange={(e) => updateAlert(alert.id, { threshold: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="flex items-center space-x-4">
                {(['email', 'push', 'in-app'] as AlertChannel[]).map((channel) => (
                  <div className="flex items-center space-x-2" key={channel}>
                    <Switch
                      id={`${channel}-${alert.id}`}
                      checked={alert.channels.includes(channel)}
                      onCheckedChange={(checked) => {
                        const newChannels = checked
                          ? [...alert.channels, channel]
                          : alert.channels.filter((c) => c !== channel);
                        updateAlert(alert.id, { channels: newChannels });
                      }}
                    />
                    <Label htmlFor={`${channel}-${alert.id}`} className="capitalize">{channel.replace('-',' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between items-center">
        <Button onClick={addAlert} variant="outline">Add New Alert</Button>
        <Button onClick={saveConfigurations} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
function AlertsFormSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map(i => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Separator />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}