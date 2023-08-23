const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const TextProcessing = require('../../src/tokenizer/text-processing');

describe('tokenizer', () => {
  describe('text-processing', () => {
    it('no input data', () => {
      const textProcessing = new TextProcessing();

      assert.deepStrictEqual([], textProcessing.getResult());
    });

    const dataSet = [
      [
        'English',
        ['English'],
      ],
      [
        "Today's weather",
        ["Today's", 'weather'],
      ],
      [
        'node.js',
        ['node.js'],
      ],
      [
        'search engine',
        ['search', 'engine'],
      ],

      [
        '日本語',
        ['日本語'],
      ],
      [
        '日本語 英語',
        ['日本語', '英語'],
      ],
      [
        '日本語　英語',
        ['日本語', '英語'],
      ],
      [
        '日本語+英語',
        ['日本語', '+', '英語'],
      ],

      [
        '1+1の答えは2',
        ['1+1', 'の答えは', '2'],
      ],
      [
        'UNIXサーバ',
        ['UNIX', 'サーバ'],
      ],
      [
        'Wikipedia日本語サイト',
        ['Wikipedia', '日本語サイト'],
      ],
    ];

    dataSet.forEach(([input, expected]) => {
      it(`input: ${input}, expected: ${expected}`, () => {
        const textProcessing = new TextProcessing();

        textProcessing.add(input);

        const result = textProcessing.getResult();

        assert.deepStrictEqual(result, expected);
      });
    });
  });
});
