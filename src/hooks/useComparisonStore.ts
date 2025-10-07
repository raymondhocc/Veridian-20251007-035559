import { create } from 'zustand';
import { PlatformData } from '@shared/types';
import { api } from '@/lib/api-client';
interface ComparisonState {
  allMetrics: PlatformData[];
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
}
export const useComparisonStore = create<ComparisonState>((set, get) => ({
  allMetrics: [],
  isLoading: false,
  error: null,
  fetchMetrics: async () => {
    if (get().isLoading || get().allMetrics.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const data = await api<PlatformData[]>('/api/metrics/all');
      set({ allMetrics: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Failed to fetch comparison metrics:', errorMessage);
      set({ error: errorMessage, isLoading: false, allMetrics: [] });
    }
  },
}));