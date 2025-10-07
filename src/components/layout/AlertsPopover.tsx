import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAlertsStore } from '@/hooks/useAlertsStore';
import { formatDistanceToNow } from 'date-fns';
export function AlertsPopover() {
  const triggeredAlerts = useAlertsStore((state) => state.triggeredAlerts);
  const fetchTriggeredAlerts = useAlertsStore((state) => state.fetchTriggeredAlerts);
  useEffect(() => {
    fetchTriggeredAlerts();
  }, [fetchTriggeredAlerts]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {triggeredAlerts.length > 0 && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between">
          <h4 className="font-medium leading-none">Notifications</h4>
          <p className="text-sm text-muted-foreground">{triggeredAlerts.length} new</p>
        </div>
        <Separator className="my-2" />
        <div className="space-y-2">
          {triggeredAlerts.length > 0 ? (
            triggeredAlerts.map((alert) => (
              <div key={alert.id} className="text-sm">
                <p className="font-semibold">{alert.platform} {alert.metric}</p>
                <p className="text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground/70">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}