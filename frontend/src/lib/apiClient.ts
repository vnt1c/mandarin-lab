import { API_BASE_URL } from "@/lib/config";
import { supabase } from "@/lib/supabaseClient";

/**
 * The single place the frontend talks to the API. Owns base URL, Supabase
 * auth headers, response-ok checking, and error parsing, so services only
 * describe *which* endpoint they hit.
 */

/** Carries the HTTP status so callers can branch on it instead of matching strings. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** 4xx responses are caused by the request; 5xx are the server's fault. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

type RequestOptions = {
  /** Attach the caller's Supabase access token. Required by /api/saved routes. */
  auth?: boolean;
  body?: unknown;
};

async function authHeader(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new ApiError(401, error.message);

  const token = data.session?.access_token;
  if (!token) throw new ApiError(401, "Not authenticated");

  return `Bearer ${token}`;
}

/**
 * The backend's error middleware always responds with `{ error: string }`,
 * so read that rather than the raw body text.
 */
async function toApiError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => null);
  const message =
    body && typeof body.error === "string" ? body.error : `HTTP ${res.status}`;

  return new ApiError(res.status, message);
}

async function request<T>(
  method: string,
  path: string,
  { auth = false, body }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = await authHeader();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) throw await toApiError(res);

  // 204 and other empty responses have no JSON body to parse.
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>("POST", path, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options),
};
