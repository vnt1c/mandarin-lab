import { Router } from "express";
import { analyzeSentence } from "../controllers/analysis.controller";

const router = Router();

router.post("/analyze", analyzeSentence);

export default router;
