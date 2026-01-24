import { gemini } from "./geminiClient";
import { buildSentenceAnalysisPrompt } from "./chineseSentenceAnalysis.prompt";
import { sentenceAnalysisSchema } from "./chineseSentenceAnalysis.schema";
import { z } from "zod";

export async function analyzeChineseSentence(sentence: string) {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildSentenceAnalysisPrompt(sentence),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(sentenceAnalysisSchema),
    },
  });

  const text = (response.text ?? "").trim();
  if (!text) throw new Error("Gemini returned empty response text");

  const json = JSON.parse(text);
  return sentenceAnalysisSchema.parse(json);
}
