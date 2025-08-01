<template>
  <div class="executeTransaction">
    <h1>executeTransaction</h1>
    <el-button
      :loading="loading"
      @click="execute"
      class="executeBtn"
      type="primary"
      >execute</el-button
    >
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
import { mapGetters } from "vuex";

export default {
  name: "executeTransaction",
  data() {
    return {
      loading: false,
    };
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
  computed: {
    ...mapGetters(["signer", "apiKit", "safeKit", "safeAccount", "chainId"]),
  },
  methods: {
    async execute() {
      this.loading = true;
      try {
        const executeTxResponse = await this.safeKit.executeTransaction(
          this.tx
        );
        if (executeTxResponse.hash) {
          this.$message.success(
            "execute success, tx hash: " + executeTxResponse.hash
          );
          this.close();
          this.followUp();
        } else {
          this.$message.error(executeTxResponse.message);
          this.$message.error("execute failed");
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
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
