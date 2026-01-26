export function buildSentenceAnalysisPrompt(sentence: string) {
  return `You are a Chinese language teacher creating structured learning materials.

Analyze the given Chinese sentence and produce a structured breakdown for learners.

GENERAL RULES:
- Analyze the sentence exactly as written. Do NOT silently fix errors.
- If the sentence is incorrect or unnatural, include a correction.
- Always provide a full, natural English translation.
- Return ONLY valid JSON. No markdown. No explanations outside JSON.
- Do NOT include any fields that are not listed below.
- OPTIONAL fields must be OMITTED if they do not apply.

TOKENIZATION RULES:
1. Multi-character idioms (成语), fixed expressions, and compound words = ONE token
2. Grammatical particles (的, 了, 吗, etc.) = separate tokens

TOKEN REQUIREMENTS (for each token):
- text (Chinese)
- pinyin (with tone marks)
- zhuyin (Bopomofo)
- role (part of speech)
- english (contextual meaning)

OPTIONAL token fields (omit if not applicable):
- role_in_sentence
- formality ("formal" | "informal" | "very_informal")
- Do not assign formal / informal unless there is a strong reason.
- usage_tags (array of: slang, vulgar, derogatory, offensive, archaic) (do not be redundant)

Optional (OMIT if not needed):
- correction
- structures
- additional_notes

CORRECTION:
Include ONLY if the sentence is grammatically incorrect or clearly unnatural.

STRUCTURES:
- Include 0–3 reusable sentence structures only if they are genuinely useful for learners.
When explaining grammar structures, use a formal pattern only:
- Only use this for sentence structures, not just any phrase
- Must follow this structure: a string of characters and Symbolic placeholders (Subj., Obj., Verb, Time, etc.) connected by plus signs (+)
- Ensure that the highlight attribute contains the text from the sentence inputted that represents the structure

Each structure must include:
- title
- highlight (exact text from the sentence)
- rule (plain English, concise)
- examples (EXACTLY 2 items, each with sentence + translation)

ADDITIONAL NOTES:
- Include ONLY if there are important points not already covered by structures or correction.
- Omit if empty or unnecessary.

NOW ANALYZE THIS SENTENCE:
${sentence}
`;
}
