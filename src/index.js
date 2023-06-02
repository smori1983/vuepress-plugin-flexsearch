/**
 * @typedef {import('vuepress-types').Context} Context
 * @typedef {import('vuepress-types').PluginOptionAPI} PluginOptionAPI
 */

const path = require('path');

/**
 * @param {Object} options
 * @param {Context} ctx
 * @return {PluginOptionAPI}
 */
module.exports = (options, ctx) => {
  return {
    extendPageData(page) {
      page.content = page._strippedContent;
    },
    alias: {
      '@SearchBox': path.resolve(__dirname, 'components', 'SearchBoxFlexSearchBase.vue'),
    },
  };
};
