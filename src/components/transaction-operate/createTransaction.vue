<template>
  <div class="createTransaction">
    <h1>createTransaction</h1>
    <component
      :is="type"
      :data="data"
      :updateTx="updateTx"
      :close="close"
      :followUp="followUp"
    ></component>
  </div>
</template>

<script>
import transfer from "./transfer.vue";
import builder from "./builder.vue";

export default {
  name: "createTransaction",
  components: {
    transfer,
    builder,
  },
  props: {
    type: {
      type: String,
      default: () => "",
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    updateTx: {
      type: Function,
      default: () => {},
    },
    close: {
      type: Function,
      default: () => {},
    },
    followUp: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped></style>
