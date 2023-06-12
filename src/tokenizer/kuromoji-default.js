/**
 * @typedef {import('vuepress-types').Page} Page
 * @typedef {import('kuromojin').KuromojiToken} KuromojiToken
 */

const { tokenize } = require('kuromojin');
const TokenizerBase = require('./tokenizer-base');

/**
 * Default tokenizer using kuromoji (Japanese morphological analyzer).
 *
 * - tokens: Extract nouns (名詞) only.
 * - excerpt: Use markdown text.
 */
class KuromojiDefault extends TokenizerBase {
  async create(page) {
    /**
     * @type {KuromojiToken[]}
     */
    const allTokens = await tokenize(page._strippedContent);

    const tokens = allTokens
      .filter(token => token.pos === '名詞')
      .map(token => token.surface_form);

    const excerpt = this._defaultForExcerpt(page);

    return {
      tokens,
      excerpt,
    };
  }
}

module.exports = KuromojiDefault;
