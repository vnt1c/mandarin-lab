import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function numberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  if (Number.isNaN(n)) {
    throw new Error(`${name} must be a number`);
  }
  return n;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: numberEnv("PORT", 3000),

  GEMINI_API_KEY: requireEnv("GEMINI_API_KEY"),

  SUPABASE_URL: requireEnv("SUPABASE_URL"),
  SUPABASE_ANON_KEY: requireEnv("SUPABASE_ANON_KEY"),

  // strict in prod, convenient in dev
  FRONTEND_ORIGIN:
    process.env.FRONTEND_ORIGIN ??
    (process.env.NODE_ENV === "production"
      ? (() => {
          throw new Error("Missing required environment variable: FRONTEND_ORIGIN");
        })()
      : "http://localhost:5173"),
} as const;

export const isProd = env.NODE_ENV === "production";
