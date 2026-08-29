<template>
  <div>
    <p>The content of <code>@dynamic/vuepress-plugin-flexsearch/dictionary</code></p>
    <pre class="json">{{ dictionaryData }}</pre>

    <p>The content of <code>@dynamic/vuepress-plugin-flexsearch/data</code></p>
    <pre class="json">{{ searchData }}</pre>
  </div>
</template>

<script>
import data from '@dynamic/vuepress-plugin-flexsearch/data';
import dictionary from '@dynamic/vuepress-plugin-flexsearch/dictionary';

export default {
  data () {
    return {
      searchData: data,
      dictionaryData: dictionary,
    };
  },
};
</script>

<style lang="stylus" scoped>
.json {
  font-size 12px
  color white
}
</style>
