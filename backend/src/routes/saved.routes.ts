// src/routes/saved.routes.ts
import { Router } from "express";
import { requireUser, authed } from "@/middleware/requireUser.middleware";
import { saveAnalysis, listAnalyses, deleteAnalysis } from "@/controllers/saved.controller";

const router = Router();

router.get("/saved", requireUser, authed(listAnalyses));
router.post("/saved", requireUser, authed(saveAnalysis));
router.delete("/saved/:id", requireUser, authed(deleteAnalysis));

export default router;
