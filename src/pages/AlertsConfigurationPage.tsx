import { AlertsForm } from '@/components/dashboard/AlertsForm';
import { Toaster } from '@/components/ui/sonner';
export function AlertsConfigurationPage() {
  return (
    <div className="animate-fade-in">
      <AlertsForm />
      <Toaster richColors />
    </div>
  );
}