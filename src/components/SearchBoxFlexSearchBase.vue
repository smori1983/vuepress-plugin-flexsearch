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
      </li>
    </ul>
  </div>
</template>

<script>
import { Document } from 'flexsearch'
import data from '@dynamic/vuepress-plugin-flexsearch/data'

/* global FLEX_SEARCH_HOTKEYS */
/* global FLEX_SEARCH_MAX_SUGGESTIONS */
/* global FLEX_SEARCH_PATHS */
export default {
  name: 'SearchBoxFlexSearchBase',

  data () {
    return {
      /**
       * @type {Document}
       */
      doc: undefined,

      query: '',
      focused: false,
      focusIndex: 0,
      placeholder: undefined
    }
  },

  computed: {
    showSuggestions () {
      return this.focused && this.suggestions.length > 0
    },

    suggestions () {
      const query = this.query.trim().toLowerCase()

      if (query.length === 0) {
        return []
      }

      const max = this.$site.themeConfig.searchMaxSuggestions || FLEX_SEARCH_MAX_SUGGESTIONS
      const localePath = this.$localePath
      const res = []

      const matchedKeys = this.doc.search(query, {
        pluck: 'content',
        limit: max,
      })

      matchedKeys.forEach((key) => {
        const page = this.findPage(key)

        if (page === null) {
          return
        }

        // filter out results that do not match current locale
        if (this.getPageLocalePath(page) !== localePath) {
          return
        }

        // filter out results that do not match searchable paths
        if (!this.isSearchable(page)) {
          return
        }

        res.push(page)
      })

      return res
    },

    // make suggestions align right when there are not enough items
    alignRight () {
      const navCount = (this.$site.themeConfig.nav || []).length
      const repo = this.$site.repo ? 1 : 0
      return navCount + repo <= 2
    }
  },

  mounted () {
    this.placeholder = this.$site.themeConfig.searchPlaceholder || ''
    document.addEventListener('keydown', this.onHotkey)

    this.setUpFlexSearchDocument()
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.onHotkey)
  },

  methods: {
    setUpFlexSearchDocument() {
      this.doc = new Document({
        tokenize: 'reverse',
        id: 'key',
        index: [
          'content',
        ],
      })

      for (const key in data) {
        this.doc.add({
          key: key,
          content: data[key].content,
        })
      }
    },

    findPage(key) {
      return data[key] || null;
    },

    getPageLocalePath (page) {
      for (const localePath in this.$site.locales || {}) {
        if (localePath !== '/' && page.path.indexOf(localePath) === 0) {
          return localePath
        }
      }
      return '/'
    },

    isSearchable (page) {
      let searchPaths = FLEX_SEARCH_PATHS

      // all paths searchables
      if (searchPaths === null) {
        return true
      }

      searchPaths = Array.isArray(searchPaths) ? searchPaths : new Array(searchPaths)

      return searchPaths.filter(path => {
        return page.path.match(path)
      }).length > 0
    },

    onHotkey (event) {
      if (event.srcElement === document.body && FLEX_SEARCH_HOTKEYS.includes(event.key)) {
        this.$refs.input.focus()
        event.preventDefault()
      }
    },

    onUp () {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--
        } else {
          this.focusIndex = this.suggestions.length - 1
        }
      }
    },

    onDown () {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++
        } else {
          this.focusIndex = 0
        }
      }
    },

    go (i) {
      if (!this.showSuggestions) {
        return
      }

      const path = this.suggestions[i].path

      if (this.$route.path !== path) {
        this.$router.push(path)
      }

      this.query = ''
      this.focusIndex = 0
    },

    focus (i) {
      this.focusIndex = i
    },

    unfocus () {
      this.focusIndex = -1
    }
  }
}
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
    font-size 0.9rem
    line-height 2rem
    padding 0 0.5rem 0 2rem
    outline none
    transition all .2s ease
    background #fff url(search.svg) 0.6rem 0.5rem no-repeat
    background-size 1rem
    &:focus
      cursor auto
      border-color $accentColor
  .suggestions
    background #fff
    width 20rem
    position absolute
    top 2 rem
    border 1px solid darken($borderColor, 10%)
    border-radius 6px
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
      color lighten($textColor, 35%)
      .page-title
        font-weight 600
    &.focused
      background-color #f3f4f5
      a
        color $accentColor

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
