/**
 * @typedef {import('vuepress-types').Page} Page
 * @typedef {import('kuromojin').KuromojiToken} KuromojiToken
 */

const { tokenize } = require('kuromojin');
const TokenizerBase = require('./tokenizer-base');

/**
 * Default tokenizer using kuromoji (Japanese morphological analyzer).
 *
 * tokens:
 * - Extract noun prefix (接頭詞 名詞接続)
 * - Extract noun (名詞).
 *
 * excerpt:
 * - Use markdown text.
 */
class KuromojiDefault extends TokenizerBase {
  async create(page) {
    /**
     * @type {KuromojiToken[]}
     */
    const allTokens = await tokenize(page._strippedContent || '');

    const tokens = allTokens
      .filter(token => {
        if (token.pos === '接頭詞' && token.pos_detail_1 === '名詞接続') {
          return true;
        }

        if (token.pos === '名詞') {
          return true;
        }

        return false;
      })
      .map(token => token.surface_form);

    const excerpt = this._defaultForExcerpt(page);

    return {
      tokens,
      excerpt,
    };
  }
}

module.exports = KuromojiDefault;
