import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const getSession = vi.fn();
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getSession: () => getSession() } },
}));

const { api, ApiError } = await import("@/lib/apiClient");

/**
 * Error parsing used to be wrong in two different ways: one service read the
 * body as text, so the message was a raw JSON blob the UI substring-matched;
 * the other discarded the server's message entirely. These tests pin down the
 * behaviour that replaced both.
 */

function respond(
  status: number,
  body: unknown,
  headers: Record<string, string> = {}
) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  getSession.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ApiError", () => {
  it("treats 4xx as the caller's fault", () => {
    expect(new ApiError(400, "bad").isClientError).toBe(true);
    expect(new ApiError(404, "missing").isClientError).toBe(true);
    expect(new ApiError(499, "odd").isClientError).toBe(true);
  });

  it("treats 5xx as the server's fault", () => {
    expect(new ApiError(500, "boom").isClientError).toBe(false);
    expect(new ApiError(502, "upstream").isClientError).toBe(false);
  });
});

describe("requests", () => {
  it("prefixes the configured base URL", async () => {
    fetchMock.mockResolvedValue(respond(200, { ok: true }));
    await api.get("/api/saved-thing");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:3000/api/saved-thing"
    );
  });

  it("sends no Content-Type when there is no body", async () => {
    fetchMock.mockResolvedValue(respond(200, { ok: true }));
    await api.get("/api/thing");

    const init = fetchMock.mock.calls[0][1];
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("serialises the body and sets Content-Type", async () => {
    fetchMock.mockResolvedValue(respond(200, { ok: true }));
    await api.post("/api/analyze", { body: { sentence: "我爱中文" } });

    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ sentence: "我爱中文" });
  });

  it("omits the Authorization header unless auth is requested", async () => {
    fetchMock.mockResolvedValue(respond(200, { ok: true }));
    await api.get("/api/analyze");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(getSession).not.toHaveBeenCalled();
  });
});

describe("authentication", () => {
  it("attaches the Supabase access token when auth is requested", async () => {
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-abc" } },
      error: null,
    });
    fetchMock.mockResolvedValue(respond(200, { ok: true, rows: [] }));

    await api.get("/api/saved", { auth: true });

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer token-abc"
    );
  });

  it("fails with 401 when there is no session, without calling the API", async () => {
    getSession.mockResolvedValue({ data: { session: null }, error: null });

    await expect(api.get("/api/saved", { auth: true })).rejects.toMatchObject({
      status: 401,
      message: "Not authenticated",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces a session lookup failure as 401", async () => {
    getSession.mockResolvedValue({
      data: { session: null },
      error: { message: "refresh token expired" },
    });

    await expect(api.get("/api/saved", { auth: true })).rejects.toMatchObject({
      status: 401,
      message: "refresh token expired",
    });
  });
});

describe("error responses", () => {
  it("uses the server's message from the { error } envelope", async () => {
    fetchMock.mockResolvedValue(respond(400, { error: "sentence is empty" }));

    await expect(api.post("/api/analyze", { body: {} })).rejects.toMatchObject({
      status: 400,
      message: "sentence is empty",
    });
  });

  it("falls back to the status when the body has no message", async () => {
    fetchMock.mockResolvedValue(respond(500, undefined));

    await expect(api.get("/api/analyze")).rejects.toMatchObject({
      status: 500,
      message: "HTTP 500",
    });
  });

  it("falls back to the status when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>502 Bad Gateway</html>", { status: 502 })
    );

    await expect(api.get("/api/analyze")).rejects.toMatchObject({
      status: 502,
      message: "HTTP 502",
    });
  });

  it("never puts the raw JSON body into the message", async () => {
    // The old code did exactly this, and the UI substring-matched the result.
    fetchMock.mockResolvedValue(respond(400, { error: "too long" }));

    const error = (await api.get("/api/analyze").catch((e) => e)) as InstanceType<typeof ApiError>;
    expect(error.message).toBe("too long");
    expect(error.message).not.toContain("{");
  });

  it("throws ApiError, so callers can branch on status not message text", async () => {
    fetchMock.mockResolvedValue(respond(404, { error: "Not found" }));

    const error = (await api.get("/api/nope").catch((e) => e)) as InstanceType<typeof ApiError>;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.isClientError).toBe(true);
  });
});

describe("empty responses", () => {
  it("returns undefined for 204 rather than failing to parse", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.delete("/api/saved/abc")).resolves.toBeUndefined();
  });

  it("returns undefined when content-length is zero", async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 200, headers: { "content-length": "0" } })
    );
    await expect(api.get("/api/thing")).resolves.toBeUndefined();
  });

  it("parses a normal JSON body", async () => {
    fetchMock.mockResolvedValue(respond(200, { ok: true, rows: [{ id: "1" }] }));
    await expect(api.get("/api/saved")).resolves.toEqual({
      ok: true,
      rows: [{ id: "1" }],
    });
  });
});
