const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const excerpt = require('../../src/components/excerpt');

describe('components', () => {
  describe('excerpt', () => {
    const dataSet = [
      [
        'css',
        {},
        'html, css, javascript',
        'html, <strong>css</strong>, javascript',
      ],
      [
        'css',
        { aroundLength: 5 },
        'html, css, javascript',
        '... tml, <strong>css</strong>, jav ...',
      ],

      [
        'hello hello hello',
        {},
        'hello, world.',
        '<strong>hello</strong>, world.',
      ],

      [
        'java javascript',
        {},
        'Java and JavaScript',
        '<strong>Java</strong> and <strong>JavaScript</strong>',
      ],
      [
        'Java JavaScript',
        {},
        'Java and JavaScript',
        '<strong>Java</strong> and <strong>JavaScript</strong>',
      ],
      [
        'Java JavaScript',
        {},
        'java and javascript',
        '<strong>java</strong> and <strong>javascript</strong>',
      ],

      [
        'bug',
        {},
        'It is <b>NOT</b> a bug',
        'It is &lt;b&gt;NOT&lt;/b&gt; a <strong>bug</strong>',
      ],

      [
        '9',
        {},
        'weight is 999kg',
        'weight is <strong>9</strong><strong>9</strong><strong>9</strong>kg',
      ],
      [
        '99',
        {},
        'weight is 999kg',
        'weight is <strong>99</strong>9kg',
      ],
      [
        '999',
        {},
        'weight is 999kg',
        'weight is <strong>999</strong>kg',
      ],
      [
        '9999',
        {},
        'weight is 999kg',
        'weight is 999kg',
      ],
      [
        '9999',
        { aroundLength: 5 },
        'weight is 999kg',
        'weigh ...',
      ],

    ];

    dataSet.forEach(([query, option, content, highlighted]) => {
      it(`query: ${query}, option: ${JSON.stringify(option)} content: ${content}`, () => {
        const result = excerpt.create(content, query, option);

        assert.deepStrictEqual(result, highlighted);
      });
    });
  });
});
