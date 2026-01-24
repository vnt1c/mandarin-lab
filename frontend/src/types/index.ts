export interface User {
  id: string;
  email: string;
}

export interface Token {
  id: string;
  hanzi: string;
  pinyin: string;
  pos: string;
  gloss: string;
  grammarNote?: string;
  dependencyRole?: string;
}

export interface SentenceAnalysis {
  id: string;
  input: string;
  tokens: Token[];
  notes: string[];
  createdAt: string;
  tags?: string[];
}

export interface ExampleSentence {
  hanzi: string;
  pinyin: string;
  gloss: string;
}

export interface DictionaryEntry {
  headword: string;
  pinyin: string;
  hsk?: number;
  frequency?: string;
  senses: {
    pos: string;
    def: string;
  }[];
  examples: ExampleSentence[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
