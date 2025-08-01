<template>
  <div class="swapOwner">
    <div class="item">
      <div class="left">{{ $t("message.oldOwner") }}:</div>
      <div class="right">
        {{ data.oldOwner }}
      </div>
    </div>
    <div class="item">
      <div class="left">{{ $t("message.newOwner") }}:</div>
      <div class="right">
        <el-input
          style="width: 100%"
          v-model="newOwner"
          :placeholder="$t('message.enterNewOwner')"
        ></el-input>
      </div>
    </div>
    <el-button :loading="loading" @click="confirm" type="primary">
      {{ $t("message.confirm") }}
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Web3 from "web3";

export default {
  name: "changeThreshold",
  data() {
    return {
      newOwner: "",
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
        const web3 = new Web3(window.ethereum);
        if (!web3.utils.isAddress(this.newOwner)) {
          this.$message.error(this.$t("message.errorEnterAddress"));
          return;
        }
        const safeTx = await this.safeKit.createSwapOwnerTx({
          oldOwnerAddress: this.data.oldOwner,
          newOwnerAddress: this.newOwner,
        });
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
.swapOwner {
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
