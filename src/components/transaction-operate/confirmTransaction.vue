<template>
  <div class="confirmTransaction">
    <h1>confirmTransaction</h1>
    <div class="tx-item">
      <div class="left">to:</div>
      <div class="right">{{ tx.to }}</div>
    </div>
    <div class="tx-item">
      <div class="left">dataDecoded:</div>
      <div class="right">{{ JSON.stringify(tx.dataDecoded, null, 2) }}</div>
    </div>
    <div class="tx-item">
      <div class="left">value:</div>
      <div class="right">{{ tx.value }}</div>
    </div>
    <el-button @click="sign" type="primary">{{ $t("message.sign") }}</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "confirmTransaction",
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
    async sign() {
      const { safeTxHash } = this.tx;
      const signature = await this.safeKit.signHash(safeTxHash);
      await this.apiKit.confirmTransaction(safeTxHash, signature.data);
      this.close();
      this.$message.success("confirm success");
      this.followUp();
    },
  },
};
</script>

<style lang="scss" scoped>
.confirmTransaction {
  width: 100%;
  .tx-item {
    display: flex;
    .left {
      margin-left: 20px;
      min-width: 140px;
      text-align: left;
    }
    .right {
      flex: 1;
      text-align: left;
      white-space: pre-wrap;
    }
  }
}
</style>
