const kuromojiDefault = require('./tokenizer/kuromoji-default');

/**
 * @type {Map<string, Object>}
 */
const tokenizers = new Map();

const use = (type) => {
  if (!tokenizers.has(type)) {
    throw new Error(`tokenizer type not found: ${type}`);
  }

  return tokenizers.get(type);
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
