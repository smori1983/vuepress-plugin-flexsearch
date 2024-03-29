<template>
  <div class="search-box">
    <form @submit.prevent="go(focusIndex)">
      <input
        ref="input"
        aria-label="Search"
        :value="query"
        :class="{ 'focused': focused }"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        @input="query = $event.target.value"
        @focus="focused = true"
        @blur="focused = false"
        @keyup.up="onUp"
        @keyup.down="onDown"
      >
    </form>
    <ul
      ref="suggestions"
      v-if="showSuggestions"
      class="suggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="suggestion"
        :class="{ focused: i === focusIndex }"
        @mousedown="go(i)"
        @mouseenter="focus(i)"
      >
        <a
          :href="s.path"
          @click.prevent
        >
          <span class="page-title">{{ s.title || s.path }}</span>
        </a>

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

/* global FLEX_SEARCH_HOTKEYS */
/* global FLEX_SEARCH_UI_ALIGN_RIGHT_FACTOR */
export default {
  name: 'SearchBoxFlexSearchBase',

  mixins: [
    databaseMixin,
  ],

  data () {
    return {
      query: '',
      focused: false,
      focusIndex: 0,
      placeholder: undefined,
    };
  },

  watch: {
    focused () {
      this.$nextTick(() => {
        this.resizeSuggestionsBox();
      });
    },

    suggestions () {
      this.$nextTick(() => {
        this.resizeSuggestionsBox();
      });
    },
  },

  computed: {
    showSuggestions () {
      return this.focused && this.suggestions.length > 0;
    },

    /**
     * @return {{title: string, path: string, excerpt: string}[]}
     */
    suggestions () {
      return this.databaseSearch(this.query);
    },

    // make suggestions align right when there are not enough items
    alignRight () {
      const navCount = (this.$site.themeConfig.nav || []).length;
      const repo = this.$site.repo ? 1 : 0;
      return navCount + repo <= FLEX_SEARCH_UI_ALIGN_RIGHT_FACTOR;
    },
  },

  mounted () {
    this.placeholder = this.$site.themeConfig.searchPlaceholder || '';
    window.addEventListener('resize', this.resizeSuggestionsBox);
    document.addEventListener('keydown', this.onHotkey);

    this.databaseInit();
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.onHotkey);
  },

  methods: {
    resizeSuggestionsBox () {
      if (this.$refs.suggestions) {
        this.$refs.suggestions.style.maxHeight = (window.innerHeight - 100) + 'px';
      }
    },

    onHotkey (event) {
      if (event.srcElement === document.body && FLEX_SEARCH_HOTKEYS.includes(event.key)) {
        this.$refs.input.focus();
        event.preventDefault();
      }
    },

    onUp () {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },

    onDown () {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },

    go (i) {
      if (!this.showSuggestions) {
        return;
      }

      const path = this.suggestions[i].path;

      if (this.$route.path !== path) {
        this.$router.push(path);
      }

      this.$refs.input.blur();
    },

    focus (i) {
      this.focusIndex = i;
    },

    unfocus () {
      this.focusIndex = -1;
    },
  },
};
</script>

<style lang="stylus">
.search-box
  display inline-block
  position relative
  margin-right 1rem
  input
    cursor text
    width 10rem
    height: 2rem
    color lighten($textColor, 25%)
    display inline-block
    border 1px solid darken($borderColor, 10%)
    border-radius 2rem
    font-size 16px
    line-height 2rem
    padding 0 0.5rem 0 2rem
    outline none
    transition all .2s ease
    background #fff url(search.svg) 0.6rem 0.5rem no-repeat
    background-size 1rem
    &:focus
      cursor auto
      border-color $accentColor
      width 15rem
  .suggestions
    overflow-y scroll
    background #fff
    width 40rem
    position absolute
    top 2 rem
    border 1px solid darken($borderColor, 10%)
    border-radius 6px
    font-size 16px
    padding 0.4rem
    list-style-type none
    &.align-right
      right 0
  .suggestion
    line-height 1.4
    padding 0.4rem 0.6rem
    border-radius 4px
    cursor pointer
    a
      white-space normal
      color $accentColor
      .page-title
        font-weight 600
    &.focused
      background-color #f3f4f5
    .page-excerpt
      margin 1rem 0 0 1rem
      color lighten($textColor, 25%)
      font-size 90%
      white-space normal
      word-break break-all
      strong
        color $textColor

@media (max-width: $MQNarrow)
  .search-box
    input
      cursor pointer
      width 0
      border-color transparent
      position relative
      &:focus
        cursor text
        left 0
        width 10rem

// Match IE11
@media all and (-ms-high-contrast: none)
  .search-box input
    height 2rem

@media (max-width: $MQNarrow) and (min-width: $MQMobile)
  .search-box
    .suggestions
      left 0

@media (max-width: $MQMobile)
  .search-box
    margin-right 0
    input
      left 1rem
    .suggestions
      right 0

@media (max-width: $MQMobileNarrow)
  .search-box
    .suggestions
      width calc(100vw - 4rem)
    input:focus
      width 8rem
</style>
