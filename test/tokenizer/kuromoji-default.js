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

      [
        '日本語を解析する',
        '日本語 解析',
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
