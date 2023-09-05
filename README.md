# vuepress-plugin-flexsearch

VuePress plugin for FlexSearch.


## Config

`.vuepress/config.js`

```js
module.exports = {

  plugins: [
    ['@smori1983/vuepress-plugin-flexsearch', {
      //searchHotKeys: ['s', '/'],
      //searchMaxSuggestions: 20,
      //searchPaths: null,
      //uiAlignRightFactor: 10,
      //excerptAroundLength: 100,
      //excerptHeadText: '... ',
      //excerptTailText: ' ...',
      //tokenizerType: 'kuromoji.default',
      //ngramSize: 3,
    }],
  ],

};
```

Some configs are same as default `@vuepress/plugin-search`.

### searchHotKeys

- Type: `string[]`
- Default: `['s', '/']`

Set to an empty array to disable this feature.

### searchMaxSuggestions

- Type: `number`
- Default: `20`

The maximum number of results for search.

### searchPaths

- Type: `RegExp` | `RegExp[]`
- Default: `null`

Configure if you want to limit the searchable paths.

### uiAlignRightFactor

- Type: `number`
- Default: `10`

Condition to add class attribute of `align-light` to suggestions area, which will be added when the number of navbar menus is less than `uiAlignRightFactor`.

### excerptAroundLength

- Type: `number`
- Default: `100`

Define how many texts are shown around first matched text on the excerpt of the result.

### excerptHeadText

- Type: `string`
- Default: `'... '`

Define text which is shown for abbreviation if preceding text is longer than `excerptAroundLength` on the excerpt of the result.

### excerptTailText

- Type: `string`
- Default: `' ...'`

Define text which is shown for abbreviation if succeeding text is longer than `excerptAroundLength` on the excerpt of the result.

### tokenizerType

- Type: `string`
- Default: `'kuromoji.default'`

### ngramSize

- Type: `number`
- Default: `3`


## Dev server launch option

If env variable `VUEPRESS_FLEXSEARCH` is defined as `disabled`, the plugin does not create search data on `ready()` callback.

It will be helpful if there are too many pages and so it takes long time to launch.

Example:

```json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "dev:light": "VUEPRESS_FLEXSEARCH=disabled vuepress dev docs",
    "build": "vuepress build docs"
  }
}
```
