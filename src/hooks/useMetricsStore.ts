import { create } from 'zustand';
import { Platform, PlatformData } from '@shared/types';
import { api } from '@/lib/api-client';
interface MetricsState {
  platform: Platform;
  metrics: PlatformData | null;
  isLoading: boolean;
  error: string | null;
  setPlatform: (platform: Platform) => void;
  fetchMetrics: () => Promise<void>;
}
export const useMetricsStore = create<MetricsState>((set, get) => ({
  platform: 'Solana',
  metrics: null,
  isLoading: true,
  error: null,
  setPlatform: (platform) => {
    if (get().platform !== platform) {
      set({ platform, metrics: null, isLoading: true, error: null });
      get().fetchMetrics();
    }
  },
  fetchMetrics: async () => {
    const platform = get().platform;
    set({ isLoading: true, error: null });
    try {
      const data = await api<PlatformData>(`/api/metrics/${platform.toLowerCase()}`);
      set({ metrics: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(`Failed to fetch metrics for ${platform}:`, errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));