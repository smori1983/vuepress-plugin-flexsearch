/**
 * @typedef {import('vuepress-types').Context} Context
 * @typedef {import('vuepress-types').PluginOptionAPI} PluginOptionAPI
 */

const path = require('path');

const flexSearchData = {};

/**
 * @param {Object} options
 * @param {Context} ctx
 * @return {PluginOptionAPI}
 */
module.exports = (options, ctx) => {
  return {
    alias: {
      '@SearchBox': path.resolve(__dirname, 'components', 'SearchBoxFlexSearchBase.vue'),
    },
    async ready() {
      for (const page of ctx.pages) {
        flexSearchData[page.key] = {
          title: page.title,
          path: page.regularPath,
          content: page._strippedContent,
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
