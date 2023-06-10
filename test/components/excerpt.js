const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const excerpt = require('../../src/components/excerpt');

describe('components', () => {
  describe('excerpt', () => {
    const dataSet = [
      [
        'css',
        'html, css, javascript',
        'html, <strong>css</strong>, javascript',
      ],

      [
        'hello hello hello',
        'hello, world.',
        '<strong>hello</strong>, world.',
      ],

      [
        'java javascript',
        'Java and JavaScript',
        '<strong>Java</strong> and <strong>JavaScript</strong>',
      ],
      [
        'Java JavaScript',
        'Java and JavaScript',
        '<strong>Java</strong> and <strong>JavaScript</strong>',
      ],
      [
        'Java JavaScript',
        'java and javascript',
        '<strong>java</strong> and <strong>javascript</strong>',
      ],
    ];

    dataSet.forEach(([query, content, highlighted]) => {
      it (`query: ${query}, content: ${content}`, () => {
        const result = excerpt.create(content, query);

        assert.deepStrictEqual(result, highlighted);
      });
    });
  });
});
