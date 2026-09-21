export function buildSentenceAnalysisPrompt(sentence: string) {
  return `You are a Chinese language teacher producing STRICT JSON learning data.

Task: Analyze the Chinese sentence and output ONLY valid JSON (no markdown, no extra text).

Hard constraints:
- Analyze the sentence EXACTLY as written. Do not silently fix or rewrite it.
- If it is incorrect or clearly unnatural, include a correction field (otherwise OMIT correction).
- Provide ONE full, natural English translation of the original sentence.
- Output must include ONLY the fields listed below. Omit any optional field when not needed.

Tokenization rules:
1) 成语 / fixed expressions / compound words = ONE token.
2) Particles (的, 了, 吗, etc.) are separate tokens.
3) Do not invent tokens that are not present in the input.

Structures rules (0–3 only):
- Include only real, reusable grammar structures.
- highlight must be exact text from the sentence.
- examples must be EXACTLY 2 items.

Now analyze this sentence:
${sentence}`;
}