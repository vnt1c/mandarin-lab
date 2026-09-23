import { Router } from "express";
import { analyzeSentence } from "@/controllers/analysis.controller";

const router = Router();

// Express 5's router forwards a rejected promise to the error middleware on
// its own, so async handlers need no wrapper.
router.post("/analyze", analyzeSentence);

export default router;
