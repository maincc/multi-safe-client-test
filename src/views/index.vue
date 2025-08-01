<template>
  <div class="index-view">
    <web-top></web-top>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import WebTop from "../components/web-top.vue";
export default {
  name: "indexView",
  components: {
    WebTop,
  },
};
</script>

<style lang="scss" scoped>
.index-view {
  height: 100%;
  .content {
    height: calc(100% - 60px);
  }
}
</style>
