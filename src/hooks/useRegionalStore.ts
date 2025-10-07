import { create } from 'zustand';
import { RegionalMetric } from '@shared/types';
import { api } from '@/lib/api-client';
interface RegionalState {
  regionalData: RegionalMetric[];
  isLoading: boolean;
  error: string | null;
  fetchRegionalData: () => Promise<void>;
}
export const useRegionalStore = create<RegionalState>((set, get) => ({
  regionalData: [],
  isLoading: false,
  error: null,
  fetchRegionalData: async () => {
    if (get().isLoading || get().regionalData.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const data = await api<RegionalMetric[]>('/api/metrics/regional');
      set({ regionalData: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Failed to fetch regional metrics:', errorMessage);
      set({ error: errorMessage, isLoading: false, regionalData: [] });
    }
  },
}));