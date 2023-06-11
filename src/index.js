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
    searchMaxSuggestions = 5,
    searchPaths = null,
  } = options;

  return {
    define: {
      FLEX_SEARCH_HOTKEYS: searchHotKeys,
      FLEX_SEARCH_MAX_SUGGESTIONS: searchMaxSuggestions,
      FLEX_SEARCH_PATHS: searchPaths,
    },

    alias: {
      '@SearchBox': path.resolve(__dirname, 'components', 'SearchBoxFlexSearchBase.vue'),
    },

    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceAppFile.js'),
    ],

    async ready() {
      /** @type {Map<string, Map<string, Object>>} */
      const localeBasedPageData = new Map([
        ['/', new Map()],
      ]);

      for (const localePath in ctx.themeConfig.locales || {}) {
        if (localePath !== '/') {
          localeBasedPageData.set(localePath, new Map());
        }
      }

      for (const page of ctx.pages) {
        const frontmatter = page._computed.$frontmatter;

        if (frontmatter.search === false) {
          continue;
        }

        const localePath = page._computed.$localePath;

        if (!localeBasedPageData.has(localePath)) {
          continue;
        }

        const tokens = await tokenize(page._strippedContent);
        const keywords = [];

        tokens.forEach((token) => {
          if (['名詞'].includes(token.pos)) {
            if (token.surface_form.trim().length >= 1) {
              keywords.push(token.surface_form);
            }
          }
        });

        localeBasedPageData.get(localePath).set(page.key, {
          title: page.title,
          path: page.regularPath,
          searchData: keywords.join(' '),
          content: page._strippedContent.replace(/[\r\n\s]+/g, ' '),
        });
      }

      localeBasedPageData.forEach((localePages, locale) => {
        flexSearchData[locale] = {};

        localePages.forEach((pageData, key) => {
          flexSearchData[locale][key] = pageData;
        });
      });
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
