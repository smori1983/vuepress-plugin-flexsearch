<template>
  <div>
    <form
      @submit.prevent="submit"
      class="search-form"
    >
      <input
        v-model="query"
      />
    </form>
    <ul
      v-if="searchResult.length > 0"
      class="suggestions"
    >
      <li
        v-for="(s, i) in searchResult"
        :key="i"
        class="suggestion"
      >
        <router-link :to="s.path">
          <span class="page-title">{{ s.title || s.path }}</span>
        </router-link>

        <div
          v-html="s.excerpt"
          class="page-excerpt"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script>
import data from '@dynamic/vuepress-plugin-flexsearch/data';
import Database from './database';
import excerpt from './excerpt';
import ngram from '../tokenizer/ngram';

/* global FLEX_SEARCH_MAX_SUGGESTIONS */
/* global FLEX_SEARCH_EXCERPT_AROUND_LENGTH */
/* global FLEX_SEARCH_EXCERPT_HEAD_TEXT */
/* global FLEX_SEARCH_EXCERPT_TAIL_TEXT */
/* global FLEX_SEARCH_NGRAM_SIZE */
export default {
  name: 'PluginFlexSearchForm',

  props: {
    queryParam: {
      type: String,
      default: 'q',
    },
  },

  data () {
    return {
      database: new Database(),

      query: '',
      searchResult: [],
    };
  },

  mounted() {
    for (const locale in data) {
      // Consider the case locale defined but no pages created.
      this.database.add(locale, data[locale] || {});
    }

    this.query = this.$router.currentRoute.query[this.queryParam] || '';
    this.updateSearchResult();
  },

  watch: {
    $route (to, from) {
      this.query = to.query[this.queryParam] || '';
      this.updateSearchResult();
    },
  },

  methods: {
    submit () {
      const queryParam = this.$router.currentRoute.query[this.queryParam] || '';
      const query = this.query;
      if (queryParam !== query) {
        this.$router.push({
          path: this.$router.currentRoute.path,
          query: {
            [this.queryParam]: query,
          },
        });
      }
    },
    updateSearchResult () {
      this.searchResult = this.search();
    },
    search () {
      const query = this.query.trim();

      if (query.length === 0) {
        return [];
      }

      const localePath = this.$localePath;
      const queryForSearch = ngram.createForSearch(query, FLEX_SEARCH_NGRAM_SIZE);
      const max = this.$site.themeConfig.searchMaxSuggestions || FLEX_SEARCH_MAX_SUGGESTIONS;

      const matchedKeys = this.database.search(localePath, queryForSearch, max);

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
  }
};
</script>

<style lang="stylus" scoped>
.search-form
  input
    cursor text
    width calc(100% - 3rem)
    height: 2rem
    color lighten($textColor, 25%)
    border 1px solid darken($borderColor, 10%)
    border-radius 2rem
    font-size 16px
    line-height 2rem
    padding 0 1rem 0 2rem
    outline none
    background #fff url(search.svg) 0.6rem 0.5rem no-repeat
    background-size 1rem
    &:focus
      border-color $accentColor
.suggestions
  border 1px solid darken($borderColor, 10%)
  font-size 16px
  padding 0.4rem
  list-style-type none
.suggestion
  line-height 1.4
  padding 0.4rem 0.6rem
  border-radius 4px
  a
    white-space normal
    color $accentColor
    .page-title
      font-weight 600
  .page-excerpt
    margin 1rem 0 0 1rem
    color lighten($textColor, 25%)
    font-size 90%
    white-space normal
    word-break break-all
    strong
      color $textColor
</style>
