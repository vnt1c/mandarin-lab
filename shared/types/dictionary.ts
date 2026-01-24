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
