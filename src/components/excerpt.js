const { escape } = require('he');

/**
 * @param {string} content
 * @param {string} query
 * @return {string}
 */
const create = (content, query) => {
  const queries = query
    .split(/\s+/)
    .map(q => q.toLowerCase());

  for (let i = 0, len = queries.length; i < len; i++) {
    const position = content.toLowerCase().indexOf(queries[i]);

    if (position >= 0) {
      const from = Math.max(0, position - 50);
      const to = position + queries[i].length + 50;
      const head = from > 0 ? '... ' : '';
      const tail = content.length > to ? ' ...' : '';

      return head + highlight(content.slice(from, to), queries) + tail;
    }
  }

  return '';
};

/**
 * @param {string} excerpt
 * @param {string[]} queries
 * @return {string}
 */
const highlight = (excerpt, queries) => {
  const excerptLowerCase = excerpt.toLowerCase();
  const sortedQueries = sortQueries(queries);

  let result = '';

  for (let pos = 0, len = excerpt.length; pos < len; ) {
    const matchedQuery = findMatchedQuery(excerptLowerCase, pos, sortedQueries);

    if (typeof matchedQuery === 'string') {
      result += '<strong>' + escape(excerpt.slice(pos, pos + matchedQuery.length)) + '</strong>';
      pos += matchedQuery.length;
    } else {
      result += escape(excerpt.slice(pos, pos + 1));
      pos += 1;
    }
  }

  return result;
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
