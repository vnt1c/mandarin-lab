import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Properties our middleware attaches to the request.
 *
 * `id` is set by requestId on every request, so it is always present.
 * `user`/`supabase` are set only by requireUser, so they are optional here
 * and narrowed by `authed()` on the routes that run behind it.
 */
declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: { id: string };
      supabase?: SupabaseClient;
    }
  }
}

export {};
