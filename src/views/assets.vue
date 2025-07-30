<template>
  <div class="assets-content" v-loading="loading">
    <div style="margin-top: 30px">
      <span>{{ $t("message.fiatTotal") }}: ${{ fiatTotal }}</span>
    </div>
    <el-table :data="tokens" style="width: 100%; margin-top: 20px">
      <el-table-column prop="tokenInfo.name" :label="$t('message.assets')">
      </el-table-column>
      <el-table-column :label="$t('message.balance')">
        <template slot-scope="scope">
          {{
            showAmount(
              scope.row.balance,
              scope.row.tokenInfo.decimals,
              scope.row.tokenInfo.symbol
            )
          }}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="primary" @click="createTx(scope.row)">{{
            $t("message.send")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAssets } from "@/js/api/v1/safe";
import { BigNumber } from "bignumber.js";
import transactionOperate from "@/components/transaction-operate";

export default {
  name: "assets",
  data() {
    return {
      loading: false,
      fiatTotal: 0,
      tokens: [],
    };
  },
  computed: {
    ...mapGetters(["chainId", "safeAccount"]),
  },
  async mounted() {
    this.loading = true;
    try {
      if (this.chainId && this.safeAccount) {
        const res = await getAssets(this.chainId, this.safeAccount);
        this.fiatTotal = res.fiatTotal;
        this.tokens = res.items;
      } else {
        this.$message.error(this.$t("message.pleaseConnectWallet"));
        this.$router.push("/");
      }
    } catch (error) {
      this.$message.error(error.message);
    } finally {
      this.loading = false;
    }
  },
  destroyed() {
    transactionOperate().close();
  },
  methods: {
    createTx(tokenInfo) {
      transactionOperate().create("transfer", tokenInfo, () => {
        this.$router.push("/transaction");
      });
    },
    showAmount(balance, decimals, symbol) {
      return (
        new BigNumber(balance).div(new BigNumber(10).pow(decimals)).toNumber() +
        " " +
        symbol
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
