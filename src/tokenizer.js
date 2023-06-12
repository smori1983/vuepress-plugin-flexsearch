/**
 * @typedef {import('vuepress-types').Page} Page
 */

const ngram = require('./tokenizer/ngram');
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
    dataForSearch: ngram.create(data.keywords.join(''), 3).join(' '),
    dataForExcerpt: data.excerpt,
  };
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
