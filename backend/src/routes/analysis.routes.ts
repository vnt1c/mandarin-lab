import { Router } from "express";
import { analyzeSentence } from "@/controllers/analysis.controller";
import { asyncHandler } from "@/lib/asyncHandler";

const router = Router();

router.post("/analyze", asyncHandler(analyzeSentence));

export default router;