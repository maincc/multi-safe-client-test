<template>
  <div class="addOwner">
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
    <div class="item">
      <div class="left">{{ $t("message.newThreshold") }}</div>
      <div class="right">
        <el-input-number
          v-model="threshold"
          :min="1"
          :max="data.maxThreshold + 1"
          label="描述文字"
        ></el-input-number>
      </div>
      <el-button :loading="loading" @click="confirm" type="primary">
        {{ $t("message.confirm") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Web3 from "web3";

export default {
  name: "addOwner",
  data() {
    return {
      newOwner: "",
      threshold: 0,
      loading: false,
    };
  },
  mounted() {
    this.threshold = this.data.threshold;
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
        const safeTx = await this.safeKit.createAddOwnerTx({
          ownerAddress: this.newOwner,
          threshold: this.threshold,
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
.addOwner {
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
