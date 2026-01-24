import type { SentenceAnalysis } from '@shared';

const SAVED_KEY = 'mandarinlab_saved_sentences';

export const saveSentence = (analysis: SentenceAnalysis): void => {
  const saved = listSaved();
  const exists = saved.some((s) => s.sentence === analysis.sentence);
  
  if (!exists) {
    saved.push(analysis);
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }
};

export const listSaved = (): SentenceAnalysis[] => {
  const stored = localStorage.getItem(SAVED_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const deleteSaved = (sentence: string): void => {
  const saved = listSaved();
  const filtered = saved.filter((s) => s.sentence !== sentence);
  localStorage.setItem(SAVED_KEY, JSON.stringify(filtered));
};
