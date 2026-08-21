import { supabase } from "@/lib/supabaseClient";
import type { SentenceAnalysis, SavedAnalysis } from "@shared";
import { API_BASE_URL as API_BASE } from "@/lib/config";

async function getToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return token;
}

export async function fetchSaved(): Promise<SavedAnalysis[]> {
  const token = await getToken();

  const res = await fetch(`${API_BASE}/api/saved`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch saved sentences");
  }

  const json = await res.json();
  return json.rows as SavedAnalysis[];
}

export async function saveSaved(
  analysis: SentenceAnalysis
): Promise<SavedAnalysis> {
  const token = await getToken();

  // Wrap the analysis object in the expected structure
  const payload = {
    sentence: analysis.sentence,
    translation: analysis.translation,
    analysis: analysis,
  };

  const res = await fetch(`${API_BASE}/api/saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save sentence");
  }

  const json = await res.json();
  return json.row as SavedAnalysis;
}

export async function deleteSaved(id: string): Promise<void> {
  const token = await getToken();

  const res = await fetch(`${API_BASE}/api/saved/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete sentence");
  }
}
