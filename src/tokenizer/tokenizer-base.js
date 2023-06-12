/**
 * @typedef {import('vuepress-types').Page} Page
 */

/**
 * @typedef {Object} CreateReturnValue
 * @property {string[]} keywords
 * @property {string} excerpt
 */

class TokenizerBase {
  /**
   * @override
   * @param {Page} page
   * @return {Promise<CreateReturnValue>}
   */
  async create(page) {
    return {
      keywords: [],
      excerpt: this._defaultForExcerpt(page),
    };
  }

  /**
   * @param {Page} page
   * @protected
   */
  _defaultForExcerpt(page) {
    return page._strippedContent
      .replace(/[\r\n\s]+/g, ' ');
  }
}

module.exports = TokenizerBase;
