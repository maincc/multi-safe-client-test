<template>
  <div>
    <h1>转账</h1>
  </div>
</template>

<script>
export default {
  name: "transfer",
  props: {
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
