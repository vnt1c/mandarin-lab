import type { Request, Response } from "express";
import { analyzeChineseSentence } from "../ai";
import { HttpError } from "../lib/HttpError";
import { validateChineseSentence } from "../lib/validateSentence";

export async function analyzeSentence(req: Request, res: Response) {
  const v = validateChineseSentence(req.body?.sentence);

  if (v.ok === false) {
    throw new HttpError(400, v.message);
  }

  const sentence = v.value;

  const geminiResult = await analyzeChineseSentence(sentence);

  return res.json({
    sentence: geminiResult.sentence,
    translation: geminiResult.translation,
    example_context: geminiResult.example_context,
    correction: geminiResult.correction,
    structures: geminiResult.structures,
    tokens: geminiResult.tokens,
});
}
