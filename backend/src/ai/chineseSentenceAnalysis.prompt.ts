export function buildSentenceAnalysisPrompt(sentence: string) {
  return `You are a Chinese language teacher producing STRICT JSON learning data.

Task: Analyze the Chinese sentence and output ONLY valid JSON (no markdown, no extra text).

Hard constraints:
- Analyze the sentence EXACTLY as written. Do not silently fix or rewrite it.
- If it is incorrect or clearly unnatural, include a correction field (otherwise OMIT correction).
- Provide ONE full, natural English translation of the original sentence.
- Output must include ONLY the fields listed below. Omit any optional field when not needed.

Output JSON shape:
{
  "sentence": string,
  "translation": string,
  "tokens": [
    {
      "text": string,
      "pinyin": string,        // tone marks
      "zhuyin": string,        // bopomofo
      "role": string,          // part of speech
      "english": string,       // contextual meaning in THIS sentence

      // OPTIONAL (omit if not applicable)
      "role_in_sentence"?: string,
      "formality"?: "formal" | "informal" | "very_informal",
      "usage_tags"?: ("slang" | "vulgar" | "derogatory" | "offensive" | "archaic")[]
    }
  ],

  // OPTIONAL (omit if not needed)
  "correction"?: { "sentence": string, "notes": string },
  "structures"?: [
    {
      "title": string,
      "highlight": string,     // exact substring from the input sentence
      "pattern": string,       // placeholders + "+" only
      "rule": string,          // short plain-English
      "examples": [
        { "sentence": string, "translation": string },
        { "sentence": string, "translation": string }
      ]
    }
  ]
}

Tokenization rules:
1) 成语 / fixed expressions / compound words = ONE token.
2) Particles (的, 了, 吗, etc.) are separate tokens.
3) Do not invent tokens that are not present in the input.

Structures rules (0–3 only):
- Include only real, reusable grammar structures.
- highlight must be exact text from the sentence.
- pattern must use ONLY Chinese text and placeholders connected by "+".
- examples must be EXACTLY 2 items.

Now analyze this sentence:
${sentence}`;
}
