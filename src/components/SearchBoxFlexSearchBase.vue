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
      /** @type {Map<string, Document>} */
      docs: new Map(),

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

      if (!this.docs.has(localePath)) {
        return []
      }

      const matchedKeys = this.docs.get(localePath).search(query, {
        pluck: 'content',
        limit: max,
      })

      const res = []

      matchedKeys.forEach((key) => {
        const page = data[localePath][key]

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
      for (const locale in data) {
        const doc = new Document({
          tokenize: 'reverse',
          id: 'key',
          index: [
            'content',
          ],
        })

        // Consider the case locale defined but no pages created.
        const localeData = data[locale] || {}

        for (const key in localeData) {
          doc.add({
            key: key,
            content: localeData[key].content,
          })
        }

        this.docs.set(locale, doc)
      }
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
