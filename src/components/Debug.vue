<template>
  <pre class="json">{{ searchData }}</pre>
</template>

<script>
import data from '@dynamic/vuepress-plugin-flexsearch/data';

export default {
  data () {
    return {
      searchData: data,
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
