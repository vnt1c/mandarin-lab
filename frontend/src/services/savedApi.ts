import type { SentenceAnalysis, SavedAnalysis } from "@shared";
import { api } from "@/lib/apiClient";

/**
 * The /api/saved routes wrap their payload in an envelope, unlike /api/analyze
 * which returns the object directly. Keep the shapes here so the unwrapping is
 * checked rather than asserted with `as`.
 */
type SavedListResponse = { ok: true; rows: SavedAnalysis[] };
type SavedRowResponse = { ok: true; row: SavedAnalysis };

export async function fetchSaved(): Promise<SavedAnalysis[]> {
  const { rows } = await api.get<SavedListResponse>("/api/saved", {
    auth: true,
  });
  return rows;
}

export async function saveSaved(
  analysis: SentenceAnalysis
): Promise<SavedAnalysis> {
  // The backend derives the sentence/translation columns from the analysis,
  // so sending them again would only create a way for them to disagree.
  const { row } = await api.post<SavedRowResponse>("/api/saved", {
    auth: true,
    body: { analysis },
  });
  return row;
}

export function deleteSaved(id: string): Promise<void> {
  return api.delete<void>(`/api/saved/${id}`, { auth: true });
}
