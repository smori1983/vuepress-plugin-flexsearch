/**
 * @typedef {import('vuepress-types').Page} Page
 * @typedef {import('kuromojin').KuromojiToken} KuromojiToken
 */

const { tokenize } = require('kuromojin');

/**
 *
 * @param {Page} page
 * @return {Promise<{keywords: string[], excerpt: string}>}
 */
const create = async (page) => {
  /**
   * @type {KuromojiToken[]}
   */
  const tokens = await tokenize(page._strippedContent);

  const keywords = tokens
    .filter(token => token.pos === '名詞')
    .map(token => token.surface_form);

  const excerpt = page._strippedContent
    .replace(/[\r\n\s]+/g, ' ');

  return {
    keywords,
    excerpt,
  };
};

module.exports.create = create;
