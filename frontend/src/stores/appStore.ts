import { create } from 'zustand';
import type { SentenceAnalysis } from '@shared';

interface AppState {
  currentAnalysis: SentenceAnalysis | null;
  setCurrentAnalysis: (analysis: SentenceAnalysis | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
}));
