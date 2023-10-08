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
import databaseMixin from './database-mixin';

export default {
  name: 'PluginFlexSearchForm',

  mixins: [
    databaseMixin,
  ],

  props: {
    queryParam: {
      type: String,
      default: 'q',
    },
  },

  data () {
    return {
      query: '',
      searchResult: [],
    };
  },

  mounted () {
    this.databaseInit();

    this.query = this.$router.currentRoute.query[this.queryParam] || '';
    this.searchResult = this.databaseSearch(this.query);
  },

  watch: {
    $route (to, from) {
      this.query = to.query[this.queryParam] || '';
      this.searchResult = this.databaseSearch(this.query);
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
  },
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
