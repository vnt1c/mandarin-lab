import { create } from 'zustand';
import type { SentenceAnalysis, DictionaryEntry } from '@shared';

interface AppState {
  currentAnalysis: SentenceAnalysis | null;
  setCurrentAnalysis: (analysis: SentenceAnalysis | null) => void;
  dictionaryCache: Map<string, DictionaryEntry[]>;
  cacheDictionaryResult: (query: string, entries: DictionaryEntry[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  
  dictionaryCache: new Map(),
  cacheDictionaryResult: (query, entries) =>
    set((state) => {
      const newCache = new Map(state.dictionaryCache);
      newCache.set(query, entries);
      return { dictionaryCache: newCache };
    }),
}));
