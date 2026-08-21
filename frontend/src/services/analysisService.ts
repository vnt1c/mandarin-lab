import type { SentenceAnalysis } from "@shared";
import { API_BASE_URL } from "@/lib/config";

export async function analyzeSentence(
  sentence: string
): Promise<SentenceAnalysis> {
  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}
