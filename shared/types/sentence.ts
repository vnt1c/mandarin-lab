export type TokenFormality = "formal" | "informal" | "very_informal";

export type TokenUsageTag =
  | "slang"
  | "vulgar"
  | "derogatory"
  | "offensive"
  | "archaic";

export type TokenRole =
  | "noun"
  | "pronoun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "classifier"
  | "particle"
  | "conjunction"
  | "interjection"
  | "number"
  | "idiom"
  | "aspect_marker"
  | "localizer"
  | "modifier";

export interface Token {
  text: string;
  pinyin: string;
  zhuyin: string;

  role: TokenRole;
  english: string;

  /** Optional enrichments */
  role_in_sentence?: string;
  formality?: TokenFormality;
  usage_tags: TokenUsageTag[]; // always array, possibly empty
}

export interface Correction {
  message: string;
  corrected_sentence: string;
}

export interface SentenceStructureExample {
  sentence: string;
  translation: string;
}

export interface SentenceStructure {
  title: string;
  highlight: string;
  rule: string;
  examples: [
    SentenceStructureExample,
    SentenceStructureExample
  ];
}

export interface SentenceAnalysis {
  sentence: string;
  translation: string;

  example_context: string;

  /** Optional; omitted if none */
  correction?: Correction;

  /** Always present; empty array if none */
  structures: SentenceStructure[];

  /** Always present; empty array if none */
  additional_notes: string[];

  tokens: Token[];
}

export interface SavedAnalysis {
  id: string;
  sentence: string;
  translation: string;
  analysis: SentenceAnalysis;
  created_at: string;
  updated_at: string;
}
