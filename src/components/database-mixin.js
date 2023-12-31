import data from '@dynamic/vuepress-plugin-flexsearch/data';
import dictionary from '@dynamic/vuepress-plugin-flexsearch/dictionary';

import Database from './database';
import excerpt from './excerpt';
import dictionaryFactory from '../dictionary/factory';
import ngram from '../tokenizer/ngram';

/* global FLEX_SEARCH_MAX_SUGGESTIONS */
/* global FLEX_SEARCH_EXCERPT_AROUND_LENGTH */
/* global FLEX_SEARCH_EXCERPT_HEAD_TEXT */
/* global FLEX_SEARCH_EXCERPT_TAIL_TEXT */
/* global FLEX_SEARCH_NGRAM_SIZE */
export default {
  data () {
    return {
      database: new Database(),

      dictionaryManager: dictionaryFactory.createFromClientDynamicModule(dictionary),
    };
  },

  methods: {
    databaseInit() {
      for (const locale in data) {
        // Consider the case locale defined but no pages created.
        this.database.add(locale, data[locale] || {});
      }
    },

    /**
     * @param {string} queryRow
     * @return {{title: string, path: string, excerpt: string}[]}
     */
    databaseSearch(queryRow) {
      const queryRowTrimmed = queryRow.trim();

      if (queryRowTrimmed.length === 0) {
        return [];
      }

      const dictionaryWords = this.dictionaryManager.matchingWords(queryRowTrimmed);

      const query = [queryRowTrimmed].concat(dictionaryWords).join(' ');

      const localePath = this.$localePath;
      const queryForSearch = ngram.createForSearch(query, FLEX_SEARCH_NGRAM_SIZE);
      const limit = this.$site.themeConfig.searchMaxSuggestions || FLEX_SEARCH_MAX_SUGGESTIONS;

      const matchedKeys = this.database.search(localePath, queryForSearch, limit);

      return matchedKeys.map((key) => {
        const page = data[localePath][key];

        return {
          title: page.title,
          path: page.path,
          excerpt: excerpt.create(page.dataForExcerpt, query, {
            aroundLength: FLEX_SEARCH_EXCERPT_AROUND_LENGTH,
            headText: FLEX_SEARCH_EXCERPT_HEAD_TEXT,
            tailText: FLEX_SEARCH_EXCERPT_TAIL_TEXT,
          }),
        };
      });
    },
  },
};
