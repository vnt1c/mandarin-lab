/**
 * Behavioural rules only.
 *
 * The response shape is not described here: the service passes
 * `sentenceAnalysisSchema` to Gemini as `responseJsonSchema`, so field names,
 * types, enums and array bounds are enforced by constrained decoding, and each
 * field's `.describe()` reaches the model as its JSON Schema `description`.
 * Restating the shape here would only create a second copy to keep in sync.
 * What remains are the judgements the schema cannot express.
 */
export function buildSentenceAnalysisPrompt(sentence: string) {
  return `You are a Chinese language teacher producing structured learning data.

Analysis rules:
- Analyze the sentence EXACTLY as written. Do not silently fix or rewrite it.
- If it is incorrect or clearly unnatural, fill in "correction"; otherwise omit that field entirely.
- Translate the original sentence, not your correction of it.

Tokenization rules:
- 成语 / fixed expressions / compound words count as ONE token.
- Particles (的, 了, 吗, etc.) are separate tokens.
- Cover the sentence in order, and do not invent tokens that are not in it.
- "english" is the meaning the token carries in THIS sentence, not its dictionary gloss.

Structures rules:
- Include only real, reusable grammar patterns a learner could apply elsewhere.
- "highlight" must be text copied verbatim from the sentence.
- Use an empty array when the sentence shows no pattern worth teaching.

Now analyze this sentence:
${sentence}`;
}
