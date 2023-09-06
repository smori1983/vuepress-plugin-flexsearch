const ExcerptHtml = require('./excerpt-html');
const TextProcessing = require('./text-processing');

/**
 * @typedef {Object} ExcerptOption
 * @property {number} [aroundLength]
 * @property {string} [head]
 * @property {string} [tail]
 */

/**
 * @param {string} content
 * @param {string} query
 * @param {ExcerptOption} [option]
 * @return {string}
 */
const create = (content, query, option) => {
  const {
    aroundLength = 50,
    headText = '... ',
    tailText = ' ...',
  } = option || {};

  const contentLowerCase = content.toLowerCase();
  const queryLowerCase = query.toLowerCase();

  const textProcessing = new TextProcessing();

  textProcessing.add(queryLowerCase);

  const queries = queryLowerCase.split(/\s+/).concat(textProcessing.getResult());

  for (let i = 0, len = queries.length; i < len; i++) {
    const position = contentLowerCase.indexOf(queries[i]);

    if (position >= 0) {
      const from = Math.max(0, position - aroundLength);
      const to = position + queries[i].length + aroundLength;
      const head = from > 0 ? headText : '';
      const tail = content.length > to ? tailText : '';

      return head + highlight(content.slice(from, to), queries) + tail;
    }
  }

  return content.slice(0, aroundLength) + (content.length > aroundLength ? tailText : '');
};

/**
 * @param {string} excerpt
 * @param {string[]} queries
 * @return {string}
 */
const highlight = (excerpt, queries) => {
  const excerptHtml = new ExcerptHtml();

  const excerptLowerCase = excerpt.toLowerCase();
  const sortedQueries = sortQueries(queries);

  for (let pos = 0, len = excerpt.length; pos < len; ) {
    const matchedQuery = findMatchedQuery(excerptLowerCase, pos, sortedQueries);

    if (typeof matchedQuery === 'string') {
      excerptHtml.addHtmlTag('<strong>');
      excerptHtml.addPlainText(excerpt.slice(pos, pos + matchedQuery.length));
      excerptHtml.addHtmlTag('</strong>');

      pos += matchedQuery.length;
    } else {
      excerptHtml.addPlainText(excerpt.slice(pos, pos + 1));

      pos += 1;
    }
  }

  return excerptHtml.getResult();
};

/**
 * @param {string[]} queries
 * @return {string[]}
 */
const sortQueries = (queries) => {
  const uniqueList = Array.from(new Set(queries));

  return uniqueList.sort((a, b) => {
    if (a.length === b.length) {
      return a < b ? -1 : 1;
    } else {
      return a.length < b.length ? 1 : -1;
    }
  });
};

/**
 * @param {string} excerpt
 * @param {number} pos
 * @param {string[]} queries
 * @return {(string|null)}
 */
const findMatchedQuery = (excerpt, pos, queries) => {
  for (let i = 0, len = queries.length; i < len; i++) {
    if (excerpt.indexOf(queries[i], pos) === pos) {
      return queries[i];
    }
  }

  return null;
};

module.exports.create = create;
