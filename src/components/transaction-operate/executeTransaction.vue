<template>
  <div class="executeTransaction">
    <h1>executeTransaction</h1>
    <el-button class="executeBtn" type="primary">execute</el-button>
    <div class="tx-item">
      <div class="left">to:</div>
      <div class="right">{{ tx.to }}</div>
    </div>
    <div class="tx-item">
      <div class="left">data:</div>
      <div class="right">{{ tx.data }}</div>
    </div>
    <div class="tx-item">
      <div class="left">dataDecoded:</div>
      <div class="right">{{ tx.dataDecoded }}</div>
    </div>
    <div class="tx-item">
      <div class="left">confirmationsRequired:</div>
      <div class="right">{{ tx.confirmationsRequired }}</div>
    </div>
    <div class="tx-item">
      <div class="left">confirmations:</div>
      <div class="right">{{ tx.confirmations }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "executeTransaction",
  mounted() {
    console.log(this.tx);
  },
  props: {
    tx: {
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
  methods: {
    execute() {},
  },
};
</script>

<style lang="scss" scoped>
.executeTransaction {
  width: 100%;
  .executeBtn {
    height: 33px;
    width: 100px;
    border-radius: 25px;
    padding: 0px;
  }
  .tx-item {
    display: flex;
    .left {
      margin-left: 20px;
      min-width: 200px;
      text-align: left;
    }
    .right {
      width: calc(100% - 220px);
      text-align: left;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}
</style>
