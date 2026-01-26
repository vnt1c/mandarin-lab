import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = crypto.randomUUID();
  (req as any).id = id;
  res.setHeader("x-request-id", id);
  next();
}
