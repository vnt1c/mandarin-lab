import { z } from "zod";

/**
 * The single source of truth for the sentence-analysis contract.
 *
 * This schema is used in three places and must not be mirrored by hand:
 *  - the backend feeds it to Gemini as `responseJsonSchema` to constrain generation
 *  - the backend re-validates the model output with `safeParse`
 *  - `shared/types/sentence.ts` derives the frontend's TypeScript types via `z.infer`
 *
 * Changing a field here propagates to the API, the validation, and the frontend
 * types at once. Keep `chineseSentenceAnalysis.prompt.ts` in step with it.
 */

/**
 * Enums
 */
export const formalityEnum = z
  .enum(["formal", "informal", "very_informal"])
  .describe("Register/formality level (optional)");

/**
 * Token-only usage tags (optional)
 */
export const usageTagEnum = z
  .enum(["slang", "vulgar", "derogatory", "offensive", "archaic"])
  .describe("Token usage tag (optional)");

export const roleEnum = z
  .enum([
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "classifier",
    "particle",
    "conjunction",
    "interjection",
    "number",
    "idiom",
    "aspect_marker",
    "localizer",
    "modifier",
  ])
  .describe("Part of speech / grammatical role in this sentence");

/**
 * Token schema
 * - zhuyin is REQUIRED
 * - formality is OPTIONAL ("formal" | "informal" | "very_informal")
 * - usage_tags is OPTIONAL and TOKEN-ONLY
 */
export const tokenSchema = z.object({
  text: z.string().describe(
    "Chinese text of this token (may be multi-character for idioms/compounds)"
  ),

  pinyin: z.string().describe(
    "Pinyin with tone marks (e.g., 'shìjiè', 'méiyǒu')"
  ),

  zhuyin: z.string().describe(
    "Zhuyin/Bopomofo for this token"
  ),

  role: roleEnum,

  english: z.string().describe(
    "Contextual English meaning of THIS token in THIS sentence only"
  ),

  role_in_sentence: z.string().optional().describe(
    "Plain-English description of what this token is doing in this sentence"
  ),

  formality: formalityEnum.optional().describe(
    "Optional formality/register of this token in this context"
  ),

  usage_tags: z.array(usageTagEnum).max(3).default([]).describe(
    "Optional token usage tags (0–3)"
  ),
});

/**
 * Corrections / Suggestions (omit if none)
 */
export const correctionSchema = z.object({
  message: z.string().describe(
    "Short explanation of what to change and why"
  ),

  corrected_sentence: z.string().describe(
    "Suggested corrected / more natural sentence"
  ),
});

export const structureExampleSchema = z.object({
  sentence: z.string().describe("Example Chinese sentence"),
  translation: z.string().describe("English translation of example"),
});

/**
 * Sentence structures (0–3)
 */
export const structureSchema = z.object({
  title: z.string().describe(
    "Short name, e.g. 'Verb + 不 + Verb / Adj. + 不 + Adj.' or '向 + Direction / Person + Verb'"
  ),

  highlight: z.string().describe(
    "The exact text from the sentence representing this sentence structure, unchanged"
  ),

  rule: z.string().describe(
    "Plain-English rule that explains how to use this sentence structure"
  ),

  examples: z.array(structureExampleSchema).length(2).describe("Exactly 2 examples"),
});

/**
 * Sentence schema
 */
export const sentenceAnalysisSchema = z.object({
  sentence: z.string().describe(
    "The original Chinese sentence exactly as provided by the user, unchanged."
  ),

  translation: z.string().describe(
    "A natural, fluent English translation of the entire sentence."
  ),

  example_context: z.string().describe(
    "Realistic situations where this sentence would naturally be used."
  ),

  correction: correctionSchema.optional().describe(
    "Correction/suggestion; omit if none"
  ),

  structures: z.array(structureSchema).max(3).default([]).describe(
    "0–3 reusable sentence structures"
  ),

  tokens: z.array(tokenSchema).min(1).describe(
    "Tokens in order of appearance"
  ),
});

/**
 * Body of POST /api/saved.
 *
 * Only the analysis is sent. The `sentence` and `translation` columns are
 * derived from it server-side, so a row can never disagree with the blob it
 * stores, and the client cannot persist a shape the readers don't expect.
 */
export const saveAnalysisBodySchema = z.object({
  analysis: sentenceAnalysisSchema,
});
