<template>
  <div class="rejectTx">
    <div class="item">
      {{ $t("message.rejectTxTip", { nonce: data.nonce }) }}
    </div>
    <el-button :loading="loading" @click="confirm" type="primary">
      {{ $t("message.confirm") }}
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "rejectTx",
  data() {
    return {
      loading: false,
    };
  },
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
  computed: {
    ...mapGetters(["signer", "apiKit", "safeKit", "safeAccount", "chainId"]),
  },
  methods: {
    async confirm() {
      this.loading = true;
      try {
        const safeTx = await this.safeKit.createRejectionTransaction(
          this.data.nonce
        );
        this.updateTx(safeTx);
        this.followUp();
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
.rejectTx {
  .item {
    display: flex;
    align-items: center;
    text-align: left;
    .left {
      margin-left: 20px;
      min-width: 200px;
    }
    .right {
      width: calc(100% - 220px);
    }
  }
}
</style>
