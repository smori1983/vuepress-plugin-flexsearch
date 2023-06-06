/**
 * @typedef {import('vuepress-types').Context} Context
 * @typedef {import('vuepress-types').PluginOptionAPI} PluginOptionAPI
 */

const path = require('path');
const { tokenize } = require('kuromojin');

const flexSearchData = {};

/**
 * @param {Object} options
 * @param {Context} ctx
 * @return {PluginOptionAPI}
 */
module.exports = (options, ctx) => {
  const {
    searchHotKeys = ['s', '/'],
  } = options;

  return {
    define: {
      SEARCH_HOTKEYS: searchHotKeys,
    },

    alias: {
      '@SearchBox': path.resolve(__dirname, 'components', 'SearchBoxFlexSearchBase.vue'),
    },

    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceAppFile.js'),
    ],

    async ready() {
      for (const page of ctx.pages) {
        const tokens = await tokenize(page._strippedContent);
        const keywords = [];

        tokens.forEach((token) => {
          if (['名詞'].includes(token.pos)) {
            if (token.surface_form.trim().length >= 1) {
              keywords.push(token.surface_form);
            }
          }
        });

        flexSearchData[page.key] = {
          title: page.title,
          path: page.regularPath,
          content: keywords.join(' '),
        };
      }
    },

    clientDynamicModules() {
      return [
        {
          name: 'vuepress-plugin-flexsearch/data.js',
          content: `export default ${JSON.stringify(flexSearchData, null, 2)}`,
        },
      ];
    },
  };
};
