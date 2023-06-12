/**
 * @typedef {import('vuepress-types').Context} Context
 * @typedef {import('vuepress-types').PluginOptionAPI} PluginOptionAPI
 */

const path = require('path');
const tokenizer = require('./tokenizer');

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
    excerptAroundLength = 100,
    excerptHeadText = '... ',
    excerptTailText = ' ...',
    tokenizerType = 'kuromoji.default',
    ngramSize = 3,
  } = options;

  /**
   * @type {(null|RegExp[])}
   */
  const searchPathPatterns = ((paths) => {
    if (paths === null) {
      return null;
    } else {
      return Array.isArray(paths) ? paths : new Array(paths);
    }
  })(searchPaths);

  return {
    define: {
      FLEX_SEARCH_HOTKEYS: searchHotKeys,
      FLEX_SEARCH_MAX_SUGGESTIONS: searchMaxSuggestions,
      FLEX_SEARCH_EXCERPT_AROUND_LENGTH: excerptAroundLength,
      FLEX_SEARCH_EXCERPT_HEAD_TEXT: excerptHeadText,
      FLEX_SEARCH_EXCERPT_TAIL_TEXT: excerptTailText,
      FLEX_SEARCH_NGRAM_SIZE: ngramSize,
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

        if (searchPathPatterns !== null) {
          if (!searchPathPatterns.some(pattern => pattern.test(page.regularPath))) {
            continue;
          }
        }

        const localePath = page._computed.$localePath;

        if (!localeBasedPageData.has(localePath)) {
          continue;
        }

        const pageData = await tokenizer.use(tokenizerType, page, {
          ngramSize: ngramSize,
        });

        localeBasedPageData.get(localePath).set(page.key, {
          title: page.title,
          path: page.regularPath,
          dataForSearch: pageData.dataForSearch,
          dataForExcerpt: pageData.dataForExcerpt,
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
