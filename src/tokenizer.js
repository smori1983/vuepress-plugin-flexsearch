/**
 * @typedef {import('vuepress-types').Page} Page
 * @typedef {import('./tokenizer/tokenizer-base')} TokenizerBase
 * @typedef {import('./dictionary/manager')} DictionaryManager
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
 * @property {DictionaryManager} dictionaryManager
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
    dictionaryManager,
  } = option || {};

  const tokenizer = tokenizers.get(type);
  const data = await tokenizer.create(page);

  const dictionaryWords = dictionaryManager.matchingWords(data.tokens.join(''));

  return {
    dataForSearch: ngram.createForTokens(data.tokens.concat(dictionaryWords), ngramSize),
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
