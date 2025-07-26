<template>
  <div class="createTransaction">
    <h1>createTransaction</h1>
    <component
      :is="type"
      :data="data"
      :updateTx="updateTx"
      :close="close"
      :followUp="
        () => {
          active = steps.confirm;
        }
      "
    ></component>
  </div>
</template>

<script>
import transfer from "./transfer.vue";

export default {
  name: "createTransaction",
  components: {
    transfer,
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
