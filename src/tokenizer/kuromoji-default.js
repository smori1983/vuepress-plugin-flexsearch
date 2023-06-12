/**
 * @typedef {import('vuepress-types').Page} Page
 * @typedef {import('kuromojin').KuromojiToken} KuromojiToken
 */

const { tokenize } = require('kuromojin');
const TokenizerBase = require('./tokenizer-base');

class KuromojiDefault extends TokenizerBase {
  async create(page) {
    /**
     * @type {KuromojiToken[]}
     */
    const tokens = await tokenize(page._strippedContent);

    const keywords = tokens
      .filter(token => token.pos === '名詞')
      .map(token => token.surface_form);

    const excerpt = this._defaultForExcerpt(page);

    return {
      keywords,
      excerpt,
    };
  }
}

module.exports = KuromojiDefault;
