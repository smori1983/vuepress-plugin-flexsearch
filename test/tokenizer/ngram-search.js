const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const NgramSearch = require('../../src/tokenizer/ngram-search');

describe('tokenizer', () => {
  describe('ngram-search', () => {
    const dataSet = [
      [
        'English',
        'English',
      ],
      [
        'search engine',
        'search engine',
      ],

      [
        '日本語',
        '日本語',
      ],
      [
        'C言語',
        'C 言語',
      ],

      [
        '192.168.33.99',
        '192.168.33.99',
      ],
      [
        '1+1',
        '1+1',
      ],
      [
        '1+1の答えは2',
        '1+1 の答えは 2',
      ],
    ];

    dataSet.forEach(([input, expected]) => {
      it(`input: ${input}, expected: ${expected}`, () => {
        const ngramSearch = new NgramSearch();

        ngramSearch.add(input);

        const result = ngramSearch.getResult().join(' ');

        assert.deepStrictEqual(result, expected);
      });
    });
  });
});
