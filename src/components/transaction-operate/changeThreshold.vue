<template>
  <div class="changeThreshold">
    <div class="item">
      <div class="left">{{ $t("message.oldThreshold") }}:</div>
      <div class="right">
        {{ data.threshold }}
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
        const safeTx = await this.safeKit.createChangeThresholdTx(
          this.threshold
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
.changeThreshold {
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
