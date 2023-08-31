/**
 * @param {string} text
 * @param {number} size
 * @return {string[]}
 */
const create = (text, size) => {
  const result = [];

  for (let i = 0, len = text.length; i < len; i++) {
    result.push(text.slice(i, i + size));
  }

  return result;
};

/**
 * @param {string[]} tokens
 * @param {number} size
 * @return {string}
 */
const createForTokens = (tokens, size) => {
  return create(tokens.join(''), size).join(' ');
};

/**
 * @param {string} query
 * @param {number} size
 * @return {string}
 */
const createForSearch = (query, size) => {
  return query
    .split(/\s+/)
    .map(word => create(word, size).join(' '))
    .join(' ');
};

module.exports.create = create;
module.exports.createForTokens = createForTokens;
module.exports.createForSearch = createForSearch;
