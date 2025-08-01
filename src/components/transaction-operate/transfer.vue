<template>
  <div class="transfer">
    <div class="item">
      <div class="left">{{ $t("message.recipient") }}</div>
      <div class="right">
        <el-input
          style="width: 100%"
          v-model="recipient"
          :placeholder="$t('message.enterRecipient')"
        ></el-input>
      </div>
    </div>
    <div class="item">
      <div class="left">{{ $t("message.amount") }}</div>
      <div class="right">
        <el-input
          type="number"
          style="width: 100%"
          v-model="amount"
          :placeholder="$t('message.enterAmount')"
        ></el-input>
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
import erc20Abi from "@/js/erc20Abi.json";
import BigNumber from "bignumber.js";

export default {
  name: "transfer",
  data() {
    return {
      recipient: "",
      amount: "",
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
        if (!web3.utils.isAddress(this.recipient)) {
          this.$message.error(this.$t("message.errorEnterAddress"));
          return;
        }
        const { tokenInfo } = this.data;
        let tx = null;
        if (tokenInfo.address == "0x0000000000000000000000000000000000000000") {
          const decimals = this.data.tokenInfo.decimals;
          const amountUint256 = new BigNumber(this.amount)
            .times(new BigNumber(10).pow(decimals))
            .toNumber();
          tx = {
            to: this.recipient,
            value: amountUint256,
            data: "",
          };
        } else {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(erc20Abi, tokenInfo.address);
          const decimals = this.data.tokenInfo.decimals;
          const amountUint256 = new BigNumber(this.amount)
            .times(new BigNumber(10).pow(decimals))
            .toNumber();
          const data = contract.methods
            .transfer(this.recipient, amountUint256)
            .encodeABI();
          tx = {
            to: this.data.tokenInfo.address,
            value: 0,
            data: data,
          };
        }
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
.transfer {
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
