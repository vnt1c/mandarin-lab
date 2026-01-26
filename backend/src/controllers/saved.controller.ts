// src/controllers/saved.controller.ts
import type { Response } from "express";
import type { AuthedRequest } from "../middleware/requireUser.middleware";

export async function saveAnalysis(req: AuthedRequest, res: Response) {
  const { sentence, translation, analysis } = req.body;

  const { data, error } = await req.supabase
    .from("saved_analyses")
    .insert({
      user_id: req.user.id,  // REQUIRED with your RLS policy
      sentence,
      translation,
      analysis,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ ok: true, row: data });
}

export async function listAnalyses(req: AuthedRequest, res: Response) {
  const { data, error } = await req.supabase
    .from("saved_analyses")
    .select("id, sentence, translation, analysis, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ ok: true, rows: data });
}

export async function deleteAnalysis(req: AuthedRequest, res: Response) {
  const id = req.params.id;

  const { error } = await req.supabase
    .from("saved_analyses")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ ok: true });
}
