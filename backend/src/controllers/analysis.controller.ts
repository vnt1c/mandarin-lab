import type { Request, Response } from "express";
import { analyzeChineseSentence } from "@/ai";
import { HttpError } from "@/lib/HttpError";
import { validateChineseSentence } from "@/lib/validateSentence";

export async function analyzeSentence(req: Request, res: Response) {
  const v = validateChineseSentence(req.body?.sentence);

  if (v.ok === false) {
    throw new HttpError(400, v.message);
  }

  const sentence = v.value;

  // Already validated against sentenceAnalysisSchema, which strips unknown
  // keys — so this is exactly the shared SentenceAnalysis shape.
  const analysis = await analyzeChineseSentence(sentence);

  return res.json(analysis);
}
