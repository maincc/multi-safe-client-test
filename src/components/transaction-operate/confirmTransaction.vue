<template>
  <div class="confirmTransaction">
    <h1>confirmTransaction</h1>
    <div class="tx-item">
      <div class="left">signer:</div>
      <div class="right">{{ signer }}</div>
    </div>
    <div class="tx-item">
      <div class="left">to:</div>
      <div class="right">{{ to }}</div>
    </div>
    <div class="tx-item">
      <div class="left">data:</div>
      <div class="right">{{ data }}</div>
    </div>
    <div class="tx-item">
      <div class="left">dataDecoded:</div>
      <div class="right">{{ JSON.stringify(dataDecoded, null, 2) }}</div>
    </div>
    <div class="tx-item">
      <div class="left">value:</div>
      <div class="right">{{ value }}</div>
    </div>
    <el-button :loading="loading" @click="sign" type="primary">{{
      $t("message.sign")
    }}</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "confirmTransaction",
  data() {
    return {
      to: "",
      dataDecoded: "",
      value: "",
      data: "",
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
  async mounted() {
    console.log(this.tx);
    if (this.tx.signatures) {
      if (this.tx.data.data && this.tx.data.data != "0x") {
        this.dataDecoded = await this.apiKit.decodeData(this.tx.data.data);
      } else {
        this.dataDecoded = "- -";
      }
      this.data = this.tx.data.data;
      this.to = this.tx.data.to;
      this.value = this.tx.data.value;
    } else {
      this.dataDecoded = this.tx.dataDecoded;
      this.to = this.tx.to;
      this.value = this.tx.value;
      this.data = this.tx.data;
    }
  },
  computed: {
    ...mapGetters(["signer", "apiKit", "safeKit", "safeAccount", "chainId"]),
  },
  methods: {
    async sign() {
      this.loading = true;
      try {
        console.log(this.tx);
        if (this.tx.signatures) {
          const safeTxHash = await this.safeKit.getTransactionHash(this.tx);
          const signature = await this.safeKit.signHash(safeTxHash);
          await this.apiKit.proposeTransaction({
            safeAddress: this.safeAccount,
            safeTxHash: safeTxHash,
            safeTransactionData: this.tx.data,
            senderAddress: this.signer,
            senderSignature: signature.data,
          });
          this.close();
          this.$message.success("confirm success");
          this.followUp();
        } else {
          const { safeTxHash } = this.tx;
          const signature = await this.safeKit.signHash(safeTxHash);
          console.log(signature);
          await this.apiKit.confirmTransaction(safeTxHash, signature.data);
          this.close();
          this.$message.success("confirm success");
          this.followUp();
        }
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
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
      width: calc(100% - 220px);
      text-align: left;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}
</style>
