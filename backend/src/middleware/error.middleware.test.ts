import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "@/lib/HttpError";
import { errorMiddleware } from "@/middleware/error.middleware";

function mockRes() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & { statusCode: number; body: { error: string } };
}

const req = { id: "req-123" } as Request;
const next = vi.fn() as unknown as NextFunction;

describe("errorMiddleware", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("intentional HTTP errors", () => {
    it("uses the status and message the caller chose", () => {
      const res = mockRes();
      errorMiddleware(new HttpError(400, "sentence is empty"), req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: "sentence is empty" });
    });

    it("passes a 502 from the AI service through unchanged", () => {
      const res = mockRes();
      errorMiddleware(
        new HttpError(502, "AI service returned invalid JSON"),
        req,
        res,
        next
      );

      expect(res.statusCode).toBe(502);
      expect(res.body.error).toBe("AI service returned invalid JSON");
    });

    it("does not log an expected client error as a server fault", () => {
      errorMiddleware(new HttpError(400, "too long"), req, mockRes(), next);
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe("unexpected errors", () => {
    it("answers 500", () => {
      const res = mockRes();
      errorMiddleware(new Error("connection pool exhausted"), req, res, next);
      expect(res.statusCode).toBe(500);
    });

    it("logs with the request id so the entry can be traced", () => {
      errorMiddleware(new Error("boom"), req, mockRes(), next);
      expect(console.error).toHaveBeenCalledWith(
        "[req=req-123]",
        expect.any(Error)
      );
    });

    it("includes the detail outside production, where it helps", () => {
      // The suite runs with NODE_ENV=test, so isProd is false.
      const res = mockRes();
      errorMiddleware(new Error("connection pool exhausted"), req, res, next);
      expect(res.body.error).toContain("connection pool exhausted");
    });

    it("handles a thrown value that is not an Error", () => {
      const res = mockRes();
      errorMiddleware("just a string", req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toContain("Unknown error");
    });
  });

  describe("in production", () => {
    it("masks the detail of an unexpected error", async () => {
      vi.resetModules();
      vi.stubEnv("NODE_ENV", "production");

      // isProd is read at import time, so the module needs re-evaluating.
      const { errorMiddleware: prodMiddleware } = await import(
        "@/middleware/error.middleware"
      );
      const res = mockRes();
      prodMiddleware(new Error("connection pool exhausted"), req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Internal server error");
      expect(res.body.error).not.toContain("connection pool");

      vi.unstubAllEnvs();
      vi.resetModules();
    });
  });
});
