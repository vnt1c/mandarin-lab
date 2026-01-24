import type { DictionaryEntry } from '@shared';

const mockDictionary: DictionaryEntry[] = [
  {
    headword: '学习',
    pinyin: 'xuéxí',
    hsk: 2,
    frequency: 'Very Common',
    senses: [
      { pos: 'VERB', def: 'to study, to learn' },
      { pos: 'NOUN', def: 'study, learning' },
    ],
    examples: [
      { hanzi: '我在学习中文', pinyin: 'wǒ zài xuéxí Zhōngwén', gloss: 'I am studying Chinese' },
      { hanzi: '她爱学习', pinyin: 'tā ài xuéxí', gloss: 'She loves to study' },
    ],
  },
  {
    headword: '中文',
    pinyin: 'Zhōngwén',
    hsk: 1,
    frequency: 'Very Common',
    senses: [
      { pos: 'NOUN', def: 'Chinese language' },
    ],
    examples: [
      { hanzi: '你会说中文吗？', pinyin: 'nǐ huì shuō Zhōngwén ma?', gloss: 'Can you speak Chinese?' },
      { hanzi: '学中文很有意思', pinyin: 'xué Zhōngwén hěn yǒu yìsi', gloss: 'Learning Chinese is very interesting' },
    ],
  },
  {
    headword: '天气',
    pinyin: 'tiānqì',
    hsk: 2,
    frequency: 'Common',
    senses: [
      { pos: 'NOUN', def: 'weather' },
    ],
    examples: [
      { hanzi: '今天天气很好', pinyin: 'jīntiān tiānqì hěn hǎo', gloss: 'The weather is very good today' },
      { hanzi: '明天天气怎么样？', pinyin: 'míngtiān tiānqì zěnmeyàng?', gloss: 'How is the weather tomorrow?' },
    ],
  },
  {
    headword: '爱',
    pinyin: 'ài',
    hsk: 2,
    frequency: 'Very Common',
    senses: [
      { pos: 'VERB', def: 'to love, to like' },
      { pos: 'NOUN', def: 'love, affection' },
    ],
    examples: [
      { hanzi: '我爱你', pinyin: 'wǒ ài nǐ', gloss: 'I love you' },
      { hanzi: '他爱吃中国菜', pinyin: 'tā ài chī Zhōngguó cài', gloss: 'He loves to eat Chinese food' },
    ],
  },
];

export const lookupDictionary = async (query: string): Promise<DictionaryEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockDictionary.filter(
        (entry) =>
          entry.headword.includes(query) ||
          entry.pinyin.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results.length > 0 ? results : []);
    }, 600);
  });
};
