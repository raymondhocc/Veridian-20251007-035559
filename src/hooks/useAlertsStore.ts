import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AlertConfiguration, TriggeredAlert } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
interface AlertsState {
  configurations: AlertConfiguration[];
  triggeredAlerts: TriggeredAlert[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchConfigurations: () => Promise<void>;
  saveConfigurations: () => Promise<void>;
  fetchTriggeredAlerts: () => Promise<void>;
  addAlert: () => void;
  removeAlert: (id: string) => void;
  updateAlert: (id: string, updatedConfig: Partial<AlertConfiguration>) => void;
  setConfigurations: (configs: AlertConfiguration[]) => void;
}
export const useAlertsStore = create(
  immer<AlertsState>((set, get) => ({
    configurations: [],
    triggeredAlerts: [],
    isLoading: false,
    isSaving: false,
    error: null,
    fetchConfigurations: async () => {
      if (get().isLoading) return;
      set({ isLoading: true, error: null });
      try {
        const data = await api<AlertConfiguration[]>('/api/alerts');
        set({ configurations: data, isLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch alerts';
        console.error(errorMessage);
        set({ error: errorMessage, isLoading: false });
        toast.error('Could not load alert configurations.');
      }
    },
    saveConfigurations: async () => {
      if (get().isSaving) return;
      set({ isSaving: true, error: null });
      try {
        const currentConfigs = get().configurations;
        await api('/api/alerts', {
          method: 'POST',
          body: JSON.stringify(currentConfigs),
        });
        set({ isSaving: false });
        toast.success('Alert configurations saved successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save alerts';
        console.error(errorMessage);
        set({ error: errorMessage, isSaving: false });
        toast.error('Could not save alert configurations.');
      }
    },
    fetchTriggeredAlerts: async () => {
      // This is for mock data, so no loading state needed for now
      try {
        const data = await api<TriggeredAlert[]>('/api/alerts/triggered');
        set({ triggeredAlerts: data });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch triggered alerts';
        console.error(errorMessage);
        toast.error('Could not load notifications.');
      }
    },
    addAlert: () => {
      set((state) => {
        state.configurations.push({
          id: crypto.randomUUID(),
          platform: 'Solana',
          metric: 'gasFees',
          condition: 'above',
          threshold: 0,
          channels: ['in-app'],
          isEnabled: true,
        });
      });
      toast.info('New alert template added.');
    },
    removeAlert: (id) => {
      set((state) => {
        state.configurations = state.configurations.filter((alert) => alert.id !== id);
      });
      toast.warning('Alert removed.');
    },
    updateAlert: (id, updatedConfig) => {
      set((state) => {
        const alertIndex = state.configurations.findIndex((alert) => alert.id === id);
        if (alertIndex !== -1) {
          state.configurations[alertIndex] = {
            ...state.configurations[alertIndex],
            ...updatedConfig,
          };
        }
      });
    },
    setConfigurations: (configs) => {
      set({ configurations: configs });
    }
  }))
);