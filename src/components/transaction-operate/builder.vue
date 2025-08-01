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
    <div v-if="params.length">
      <div
        v-for="(item, index) in params"
        :key="index"
        style="padding-bottom: 10px; border-bottom: 1px solid #eee"
      >
        <div
          @click="selectFun = index"
          style="cursor: pointer; width: 100%; background: #eee"
        >
          <span
            >{{ method }}: {{ item.map((item) => item.name).join(",") }}</span
          >
        </div>
        <div v-if="selectFun === index">
          <div
            class="item"
            v-for="(input, input_index) in item"
            :key="input_index"
          >
            <div class="left">{{ input.name }}:</div>
            <div class="right">
              <el-input
                style="width: 100%"
                v-model="input.value"
                :placeholder="input.type"
              ></el-input>
            </div>
          </div>
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
import { debounce } from "lodash";

export default {
  name: "builder",
  data() {
    return {
      contract: "",
      abi: "",
      method: "",
      params: [],
      loading: false,
      selectFun: 0,
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
    method: debounce(function (val) {
      try {
        const abi = JSON.parse(this.abi);
        const functions = abi.filter(
          (item) => item.name == val && item.type === "function"
        );
        this.params = functions.map((item) => {
          return item.inputs.map((i) => {
            return {
              name: i.name,
              type: i.type,
              value: "",
            };
          });
        });
      } catch (error) {
        this.$message.error(this.$t("message.errorEnterAbiAndMethod"));
      }
    }, 500),
  },
  methods: {
    async confirm() {
      this.loading = true;
      try {
        const web3 = new Web3(window.ethereum);
        if (!web3.utils.isAddress(this.contract)) {
          this.$message.error(this.$t("message.errorEnterAddress"));
          return;
        }
        const contract = new web3.eth.Contract(
          JSON.parse(this.abi),
          this.contract
        );

        const data = contract.methods[`${this.method}`](
          ...this.params[this.selectFun].map((item) => item.value)
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
