import type { Response } from "express";
import type { AuthedRequest } from "@/middleware/requireUser.middleware";
import { saveAnalysisBodySchema } from "@shared/schemas";
import { HttpError } from "@/lib/HttpError";

export async function saveAnalysis(req: AuthedRequest, res: Response) {
  // RLS guarantees who owns the row, not what is in it. Without this, a bad
  // client can persist an analysis that later breaks every reader of the list.
  const parsed = saveAnalysisBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid analysis payload");
  }

  const { analysis } = parsed.data;

  const { data, error } = await req.supabase
    .from("saved_analyses")
    .insert({
      user_id: req.user.id, // REQUIRED with your RLS policy
      sentence: analysis.sentence,
      translation: analysis.translation,
      analysis,
    })
    .select()
    .single();

  if (error) throw new HttpError(400, error.message);
  return res.json({ ok: true, row: data });
}

export async function listAnalyses(req: AuthedRequest, res: Response) {
  const { data, error } = await req.supabase
    .from("saved_analyses")
    .select("id, sentence, translation, analysis, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw new HttpError(400, error.message);
  return res.json({ ok: true, rows: data });
}

export async function deleteAnalysis(req: AuthedRequest, res: Response) {
  const id = req.params.id;

  const { error } = await req.supabase
    .from("saved_analyses")
    .delete()
    .eq("id", id);

  if (error) throw new HttpError(400, error.message);
  return res.json({ ok: true });
}
