const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const KuromojiDefault = require('../../src/tokenizer/kuromoji-default');

describe('tokenizer', () => {
  describe('kuromoji-default', () => {
    const dataSet = [
      [
        '',
        '',
      ],

      // symbol
      [
        '192.168.33.99',
        '192 . 168 . 33 . 99',
      ],
      [
        '1+1の答えは2',
        '1 + 1 答え 2',
      ],
      [
        'C#で実装する',
        'C # 実装',
      ],

      // English and Japanese
      [
        'C言語を学習する',
        'C 言語 学習',
      ],

      // natural text
      [
        '日本語を解析する',
        '日本語 解析',
      ],
      [
        '仕様を標準化する',
        '仕様 標準 化',
      ],

      // compound noun
      [
        '最新版特別号',
        '最新 版 特別 号',
      ],
      [
        '全国高校野球選手権大会',
        '全国 高校 野球 選手権 大会',
      ],
      [
        '炭酸水',
        '炭酸 水',
      ],

      // noun prefix + noun (接頭詞 + 名詞)
      [
        '無関係',
        '無 関係',
      ],
      [
        '未分類',
        '未 分類',
      ],
    ];

    const kuromojiDefault = new KuromojiDefault();

    dataSet.forEach(([input, expected]) => {
      it(`input: '${input}', expected: '${expected}'`, async () => {
        const page = {
          _strippedContent: input,
        };

        const data = await kuromojiDefault.create(page);

        assert.deepStrictEqual(data.tokens.join(' '), expected);
      });
    });
  });
});
