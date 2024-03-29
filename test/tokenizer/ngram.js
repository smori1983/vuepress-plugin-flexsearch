const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const ngram = require('../../src/tokenizer/ngram');

describe('tokenizer', () => {
  describe('ngram', () => {
    const dataSet = [
      [
        'JavaScript',
        3,
        ['Jav', 'ava', 'vaS', 'aSc', 'Scr', 'cri', 'rip', 'ipt', 'pt', 't'],
      ],

      [
        '本日は晴天なり。',
        1,
        ['本', '日', 'は', '晴', '天', 'な', 'り', '。'],
      ],
      [
        '本日は晴天なり。',
        2,
        ['本日', '日は', 'は晴', '晴天', '天な', 'なり', 'り。', '。'],
      ],
      [
        '本日は晴天なり。',
        3,
        ['本日は', '日は晴', 'は晴天', '晴天な', '天なり', 'なり。', 'り。', '。'],
      ],
    ];

    dataSet.forEach(([input, size, expected]) => {
      it(`input: ${input}, size: ${size}`, () => {
        const result = ngram.create(input, size);

        assert.deepStrictEqual(result, expected);
      });
    })
  });
});
