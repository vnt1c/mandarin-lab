import "dotenv/config";
import express, { type Express, Request, Response, NextFunction } from 'express';
import cors from "cors";
import analysisRoutes from "./routes/analysis.routes";

const PORT: number = Number(process.env.PORT) || 3000;

const app: Express = express();

// MIDDLEWARE
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);

app.use(express.json({ 
    limit: "1mb",
}));

// ROUTES

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", analysisRoutes);

// ERROR HANDLERS

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  const status =
    typeof err === "object" && err !== null && "status" in err
      ? Number((err as any).status) || 500
      : 500;

  const message = err instanceof Error ? err.message : "Internal server error";

  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});