/**
 * @typedef {import('vuepress-types').Page} Page
 */

const kuromojiDefault = require('./tokenizer/kuromoji-default');

/**
 * @type {Map<string, Object>}
 */
const tokenizers = new Map();

/**
 *
 * @param {string} type
 * @param {Page} page
 * @return {Promise<{dataForSearch: string, dataForExcerpt: string}>}
 */
const use = async (type, page) => {
  if (!tokenizers.has(type)) {
    throw new Error(`tokenizer type not found: ${type}`);
  }

  const tokenizer = tokenizers.get(type);
  const data = await tokenizer.create(page);

  return {
    dataForSearch: createNgram(data.keywords),
    dataForExcerpt: data.excerpt,
  };
};

/**
 * @param {string[]} keywords
 * @return {string}
 */
const createNgram = (keywords) => {
  const result = [];
  const text = keywords.join('');

  // N-gram (N = 3)
  for (let i = 0, len = text.length; i < len; i++) {
    result.push(text[i] + (text[i + 1] || '') + (text[i + 2] || ''));
  }

  return result.join(' ');
};

/**
 * @param {string} type
 * @param {Object} tokenizer
 */
const register = (type, tokenizer) => {
  tokenizers.set(type, tokenizer);
};

register('kuromoji.default', kuromojiDefault);

module.exports.use = use;
module.exports.register = register;
