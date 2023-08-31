/**
 * @typedef {import('vuepress-types').Page} Page
 * @typedef {import('./tokenizer/tokenizer-base')} TokenizerBase
 */

const ngram = require('./tokenizer/ngram');
const KuromojiDefault = require('./tokenizer/kuromoji-default');

/**
 * @type {Map<string, TokenizerBase>}
 */
const tokenizers = new Map();

/**
 * @typedef {Object} TokenizerUseOption
 * @property {number} [ngramSize]
 */

/**
 * @param {string} type
 * @param {Page} page
 * @param {TokenizerUseOption} [option]
 * @return {Promise<{dataForSearch: string, dataForExcerpt: string}>}
 */
const use = async (type, page, option) => {
  if (!tokenizers.has(type)) {
    throw new Error(`tokenizer type not found: ${type}`);
  }

  const {
    ngramSize = 3,
  } = option || {};

  const tokenizer = tokenizers.get(type);
  const data = await tokenizer.create(page);

  return {
    dataForSearch: ngram.createForTokens(data.tokens, ngramSize),
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

register('kuromoji.default', new KuromojiDefault());

module.exports.use = use;
module.exports.register = register;
