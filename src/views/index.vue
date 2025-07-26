<template>
  <div class="index-view">
    <web-harder></web-harder>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import WebHarder from "../components/web-harder.vue";
export default {
  name: "indexView",
  components: {
    WebHarder,
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
