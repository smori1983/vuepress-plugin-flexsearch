/**
 * @typedef {import('vuepress-types').Page} Page
 */

const { tokenize } = require('kuromojin');

/**
 *
 * @param {Page} page
 * @return {Promise<{keywords: string[], excerpt: string}>}
 */
const create = async (page) => {
  const keywords = [];

  const tokens = await tokenize(page._strippedContent);

  tokens.forEach((token) => {
    if (['名詞'].includes(token.pos)) {
      if (token.surface_form.trim().length >= 1) {
        keywords.push(token.surface_form);
      }
    }
  });

  return {
    keywords: keywords,
    excerpt: page._strippedContent.replace(/[\r\n\s]+/g, ' '),
  }
};

module.exports.create = create;
