import { env, isProd } from "@/config/env";

import express, { type Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import analysisRoutes from "@/routes/analysis.routes";
import { errorMiddleware } from "@/middleware/error.middleware";
import { requestId } from "@/middleware/requestId.middleware";
import savedRoutes from "@/routes/saved.routes";


const app: Express = express();

if (isProd) {
  app.set("trust proxy", 1);
}

// ---- MIDDLEWARE ----
app.use(requestId);

morgan.token("req-id", (req) => (req as Request).id);

app.use(
  morgan(
    isProd
      ? ":remote-addr :method :url :status :response-time ms req=:req-id"
      : ":method :url :status :response-time ms req=:req-id",
    {
      stream: {
        write: (msg: string) => console.log(msg.trim()),
      },
    }
  )
);

app.use(helmet());

app.use(
  cors({
    // prod: strict, dev: allow localhost + whatever FRONTEND_ORIGIN is
    origin: isProd
      ? env.FRONTEND_ORIGIN
      : [env.FRONTEND_ORIGIN, "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    exposedHeaders: ["x-request-id"],
  })
);

// Body limit
app.use(
  express.json({
    limit: "1mb",
  })
);

// Rate limit
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    max: 60, // 60 requests/min per IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ---- ROUTES ----
app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/api", analysisRoutes);
app.use("/api", savedRoutes);

/* Error Handling */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorMiddleware); // General errors

// ---- START + GRACEFUL SHUTDOWN ----
const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);

  const timer = setTimeout(() => {
    console.error("Force exiting after 10s");
    process.exit(1);
  }, 10_000);

  server.close(() => {
    clearTimeout(timer);
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));