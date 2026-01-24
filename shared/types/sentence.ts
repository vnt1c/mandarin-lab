export interface Token {
  text: string;
  pinyin: string;
  role: "noun" | "pronoun" | "verb" | "adjective" | "adverb" | "preposition" | "classifier" | "particle" | "conjunction" | "interjection" | "number" | "idiom" | "aspect_marker" | "localizer" | "modifier";
  english: string;
}

export interface SentenceAnalysis {
  sentence: string;
  translation: string;
  tokens: Token[];
  example_context: string;
  additional_notes: string[];
}
