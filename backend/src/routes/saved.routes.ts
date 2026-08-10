// src/routes/saved.routes.ts
import { Router } from "express";
import { requireUser } from "@/middleware/requireUser.middleware";
import { saveAnalysis, listAnalyses, deleteAnalysis } from "@/controllers/saved.controller";

const router = Router();

router.get("/saved", requireUser, listAnalyses);
router.post("/saved", requireUser, saveAnalysis);
router.delete("/saved/:id", requireUser, deleteAnalysis);

export default router;
