// middleware/requireUser.ts
import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

export type AuthedRequest = Request & {
  user: { id: string };
  supabase: SupabaseClient; // <- key change
};

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing Authorization header" });

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return res.status(401).json({ error: "Invalid session" });

  (req as AuthedRequest).user = { id: data.user.id };
  (req as AuthedRequest).supabase = supabase;
  next();
}
