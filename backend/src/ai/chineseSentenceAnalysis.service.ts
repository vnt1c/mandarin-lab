import { gemini } from "@/ai/geminiClient";
import { buildSentenceAnalysisPrompt } from "@/ai/chineseSentenceAnalysis.prompt";
import { sentenceAnalysisSchema } from "@shared/schemas";
import { HttpError } from "@/lib/HttpError";
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

  const text = response.text?.trim();
  if (!text) {
    throw new HttpError(502, "AI service returned empty response");
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new HttpError(502, "AI service returned invalid JSON");
  }

  const parsed = sentenceAnalysisSchema.safeParse(json);
  if (!parsed.success) {
    // internal only
    console.error("Gemini schema violation", parsed.error.issues);

    throw new HttpError(
      502,
      "AI service returned an invalid response format"
    );
  }

  return parsed.data;
}
