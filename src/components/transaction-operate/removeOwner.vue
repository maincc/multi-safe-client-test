<template>
  <div class="removeOwner">
    <div class="item">
      <div class="left">{{ $t("message.removeOwner") }}:</div>
      <div class="right">
        {{ data.removeOwner }}
      </div>
    </div>
    <div class="item">
      <div class="left">{{ $t("message.newThreshold") }}</div>
      <div class="right">
        <el-input-number
          v-model="threshold"
          :min="1"
          :max="data.maxThreshold"
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

export default {
  name: "changeThreshold",
  data() {
    return {
      removeOwner: "",
      threshold: 0,
      loading: false,
    };
  },
  mounted() {
    if (this.data.threshold > this.data.maxThreshold) {
      this.threshold = this.data.maxThreshold;
    } else {
      this.threshold = this.data.threshold;
    }
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
        const safeTx = await this.safeKit.createRemoveOwnerTx({
          ownerAddress: this.data.removeOwner,
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
.removeOwner {
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
