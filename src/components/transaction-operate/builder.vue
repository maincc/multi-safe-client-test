<template>
  <div class="builder">
    <div class="item">
      <div class="left">{{ $t("message.contract") }}:</div>
      <div class="right">
        <el-input
          style="width: 100%"
          v-model="contract"
          :placeholder="$t('message.enterContract')"
        ></el-input>
      </div>
    </div>
    <div class="item">
      <div class="left">{{ $t("message.abi") }}:</div>
      <div class="right">
        <el-input
          type="textarea"
          :rows="5"
          :placeholder="$t('message.enterAbi')"
          v-model="abi"
        >
        </el-input>
      </div>
    </div>
    <div class="item" v-if="abi">
      <div class="left">{{ $t("message.method") }}:</div>
      <div class="right">
        <el-input
          style="width: 100%"
          v-model="method"
          :placeholder="$t('message.enterMethod')"
        ></el-input>
      </div>
    </div>

    <div v-if="params.length > 0">
      <div class="item" v-for="(item, index) in params" :key="index">
        <div class="left">{{ item.name }}:</div>
        <div class="right">
          <el-input
            style="width: 100%"
            v-model="params[index].value"
            :placeholder="item.type"
          ></el-input>
        </div>
      </div>
    </div>
    <el-button :loading="loading" @click="confirm" type="primary">
      {{ $t("message.confirm") }}
    </el-button>
  </div>
</template>

<script>
import Web3 from "web3";
import { mapGetters } from "vuex";

export default {
  name: "builder",
  data() {
    return {
      contract: "",
      abi: "",
      method: "",
      params: [],
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
  watch: {
    method(val) {
      const abi = JSON.parse(this.abi);
      const method = abi.find((item) => item.name === val);
      const inputs = method.inputs;
      this.params = inputs.map((item) => {
        return {
          name: item.name,
          type: item.type,
          value: "",
        };
      });
    },
  },
  methods: {
    async confirm() {
      this.loading = true;
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
          JSON.parse(this.abi),
          this.contract
        );
        const data = contract.methods[`${this.method}`](
          ...this.params.map((item) => item.value)
        ).encodeABI();
        const tx = {
          to: this.contract,
          value: 0,
          data: data,
        };
        const safeTx = await this.safeKit.createTransaction({
          transactions: [tx],
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
.builder {
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
