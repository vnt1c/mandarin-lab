import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));
const shared = fileURLToPath(new URL("../shared", import.meta.url));

export default defineConfig({
  resolve: {
    // Mirrors the "paths" in tsconfig.json. Ordered: the exact "@shared"
    // match has to win before the "@shared/" prefix rule sees it.
    alias: [
      { find: /^@shared$/, replacement: `${shared}/index.ts` },
      { find: /^@shared\/schemas$/, replacement: `${shared}/schemas/index.ts` },
      { find: /^@shared\//, replacement: `${shared}/` },
      { find: /^@\//, replacement: `${src}/` },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // config/env.ts throws at import time on a missing variable, and CI has no
    // .env file. These are placeholders; nothing here reaches a real service.
    env: {
      NODE_ENV: "test",
      GEMINI_API_KEY: "test-key",
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_ANON_KEY: "test-anon-key",
      FRONTEND_ORIGIN: "http://localhost:5173",
    },
  },
});
