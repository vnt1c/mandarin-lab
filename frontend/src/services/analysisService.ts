import type { SentenceAnalysis } from "@shared";
import { api } from "@/lib/apiClient";

export function analyzeSentence(sentence: string): Promise<SentenceAnalysis> {
  return api.post<SentenceAnalysis>("/api/analyze", { body: { sentence } });
}
