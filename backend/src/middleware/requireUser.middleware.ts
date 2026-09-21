import type { Request, RequestHandler, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { HttpError } from "@/lib/HttpError";

/** A request that has been through requireUser, so user/supabase are present. */
export type AuthedRequest = Request & {
  user: { id: string };
  supabase: SupabaseClient;
};

/**
 * Adapts a handler that expects an AuthedRequest to Express's RequestHandler.
 * Only sound behind requireUser, so the guarantee is checked here rather than
 * assumed: a route registered without requireUser fails loudly instead of
 * reading undefined off the request.
 */
export function authed(
  handler: (req: AuthedRequest, res: Response) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    if (!req.user || !req.supabase) {
      return next(new HttpError(500, "Route is missing the requireUser middleware"));
    }
    return handler(req as AuthedRequest, res);
  };
}

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

  req.user = { id: data.user.id };
  req.supabase = supabase;
  next();
}
