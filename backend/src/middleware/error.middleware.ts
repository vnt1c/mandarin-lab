import type { Request, Response, NextFunction } from "express";
import { HttpError } from "@/lib/HttpError";
import { isProd } from "@/config/env";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known, intentional HTTP errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Unknown/unexpected errors -> 500
  const reqId = ( _req as any ).id;
  console.error(`[req=${reqId}]`, err);


  const msg = err instanceof Error ? err.message : "Unknown error";
  return res.status(500).json({
    error: isProd ? "Internal server error" : `Internal server error: ${msg}`,
  });
}
