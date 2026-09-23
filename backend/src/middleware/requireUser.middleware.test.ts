import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "@/lib/HttpError";

const getUser = vi.fn();
const createClient = vi.fn(
  (_url: string, _key: string, _options: unknown) => ({ auth: { getUser } })
);

vi.mock("@supabase/supabase-js", () => ({
  createClient: (url: string, key: string, options: unknown) =>
    createClient(url, key, options),
}));

const { requireUser, authed } = await import("@/middleware/requireUser.middleware");

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
  return res as unknown as Response & { statusCode: number; body: unknown };
}

function mockReq(headers: Record<string, string> = {}) {
  return {
    header: (name: string) => headers[name.toLowerCase()],
  } as unknown as Request;
}

describe("requireUser", () => {
  beforeEach(() => {
    getUser.mockReset();
    createClient.mockClear();
  });

  it("rejects a request with no Authorization header", async () => {
    const res = mockRes();
    const next = vi.fn();

    await requireUser(mockReq(), res, next as unknown as NextFunction);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an Authorization header that is not a Bearer token", async () => {
    const res = mockRes();
    const next = vi.fn();

    await requireUser(
      mockReq({ authorization: "Basic abc123" }),
      res,
      next as unknown as NextFunction
    );

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a token Supabase does not recognise", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: { message: "bad jwt" } });
    const res = mockRes();
    const next = vi.fn();

    await requireUser(
      mockReq({ authorization: "Bearer expired-token" }),
      res,
      next as unknown as NextFunction
    );

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the user and a scoped client on success", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    const req = mockReq({ authorization: "Bearer good-token" });
    const next = vi.fn();

    await requireUser(req, mockRes(), next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toEqual({ id: "user-1" });
    expect(req.supabase).toBeDefined();
  });

  it("forwards the caller's token so row-level security applies to them", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    await requireUser(
      mockReq({ authorization: "Bearer good-token" }),
      mockRes(),
      vi.fn() as unknown as NextFunction
    );

    const options = createClient.mock.calls[0][2] as {
      global: { headers: Record<string, string> };
    };
    expect(options.global.headers.Authorization).toBe("Bearer good-token");
  });
});

describe("authed", () => {
  it("runs the handler when requireUser has populated the request", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const req = { user: { id: "user-1" }, supabase: {} } as unknown as Request;
    const next = vi.fn();

    await authed(handler)(req, mockRes(), next as unknown as NextFunction);

    expect(handler).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();
  });

  it("fails loudly when a route forgot the requireUser middleware", async () => {
    const handler = vi.fn();
    const next = vi.fn();

    await authed(handler)({} as Request, mockRes(), next as unknown as NextFunction);

    expect(handler).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();

    const forwarded = next.mock.calls[0][0] as HttpError;
    expect(forwarded).toBeInstanceOf(HttpError);
    expect(forwarded.status).toBe(500);
  });
});
