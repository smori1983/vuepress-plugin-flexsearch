/**
 * @typedef {import('vuepress-types').Context} Context
 * @typedef {import('vuepress-types').PluginOptionAPI} PluginOptionAPI
 */

const path = require('path');
const tokenizer = require('./tokenizer');
const TokenizerBase = require('./tokenizer/tokenizer-base');

const flexSearchData = {};

/**
 * @param {Object} options
 * @param {Context} ctx
 * @return {PluginOptionAPI}
 */
module.exports = (options, ctx) => {
  const {
    searchHotKeys = ['s', '/'],
    searchMaxSuggestions = 20,
    searchPaths = null,
    excerptAroundLength = 100,
    excerptHeadText = '... ',
    excerptTailText = ' ...',
    tokenizerType = 'kuromoji.default',
    ngramSize = 3,
    uiAlignRightFactor = 10,
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
      FLEX_SEARCH_UI_ALIGN_RIGHT_FACTOR: uiAlignRightFactor,
    },

    alias: {
      '@SearchBox': path.resolve(__dirname, 'components', 'SearchBoxFlexSearch.vue'),
    },

    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceAppFile.js'),
    ],

    async ready() {
      // For local dev server.
      // Skip to run tokenizer if there are too many pages
      // and so it takes long time to launch.
      if (process.env.VUEPRESS_FLEXSEARCH === 'disabled') {
        return;
      }

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

module.exports.tokenizer = tokenizer;
module.exports.TokenizerBase = TokenizerBase;
