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
      //excerptAroundLength: 100,
      //excerptHeadText: '... ',
      //excerptTailText: ' ...',
      //tokenizerType: 'kuromoji.default',
      //ngramSize: 3,
      //uiAlignRightFactor: 10,
    }],
  ],

};
```


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
