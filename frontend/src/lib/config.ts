/**
 * Single place the API base URL is resolved. The fallback matches the
 * backend's default PORT (3000) so a missing VITE_API_BASE_URL still works
 * in local dev instead of producing "undefined/api/..." URLs.
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
