import { z } from "zod";

const tokenSchema = z.object({
  text: z.string().describe(
    "Chinese text of this token (may be multi-character for idioms/compounds)"
  ),
  pinyin: z.string().describe(
    "Pinyin with tone marks (e.g., 'shìjiè', 'méiyǒu')"
  ),
  role: z.enum([
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
    "aspect_marker", // Add this - for 了, 过, 着
    "localizer",     // Add this - for 上, 里, 中
    "modifier",      // Add this - for 地, 得
  ]).describe(
    "Part of speech / grammatical role in this sentence"
  ),
  english: z.string().describe(
    "Contextual English meaning of THIS token in THIS sentence only"
  )
});

export const sentenceAnalysisSchema = z.object({
  sentence: z.string().describe(
    "The original Chinese sentence exactly as provided by the user, unchanged."
  ),

  translation: z.string().describe(
    "A natural, fluent English translation of the entire sentence. This must be a complete sentence in English, not a word-by-word gloss."
  ),

  tokens: z.array(tokenSchema).min(1).describe(
    "A list of tokens in the order they appear in the sentence. Each token represents a meaningful word, phrase, or fixed expression used in the sentence."
  ),

  example_context: z.string().describe(
    "A concise English description of realistic situations where this sentence would naturally be used, such as conversational speech, formal writing, academic discussion, professional communication, or narrative prose."
  ),

  additional_notes: z.array(z.string()).describe(
    "An array of helpful English notes highlighting non-obvious grammar points, register issues, common learner mistakes, or nuances in meaning or usage. Each note should be a concise bullet point. Do not repeat the translation or token explanations."
  ),
});


export type SentenceAnalysis = z.infer<
  typeof sentenceAnalysisSchema
>;