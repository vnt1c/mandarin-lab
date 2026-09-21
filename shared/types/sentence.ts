import type { z } from "zod";
import type {
  correctionSchema,
  formalityEnum,
  roleEnum,
  sentenceAnalysisSchema,
  structureExampleSchema,
  structureSchema,
  tokenSchema,
  usageTagEnum,
} from "../schemas/sentence.schema";

/**
 * Every type below is derived from the zod schema in `shared/schemas`, so the
 * frontend cannot drift from what the API actually returns. Do not hand-write
 * shapes here — change the schema instead.
 *
 * These are all type-only imports, so nothing pulls zod into the frontend bundle.
 */

export type TokenFormality = z.infer<typeof formalityEnum>;
export type TokenUsageTag = z.infer<typeof usageTagEnum>;
export type TokenRole = z.infer<typeof roleEnum>;

export type Token = z.infer<typeof tokenSchema>;
export type Correction = z.infer<typeof correctionSchema>;
export type SentenceStructureExample = z.infer<typeof structureExampleSchema>;
export type SentenceStructure = z.infer<typeof structureSchema>;
export type SentenceAnalysis = z.infer<typeof sentenceAnalysisSchema>;

/** A row in the `saved_analyses` table; not part of the AI contract. */
export interface SavedAnalysis {
  id: string;
  sentence: string;
  translation: string;
  analysis: SentenceAnalysis;
  created_at: string;
  updated_at: string;
}
