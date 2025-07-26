<template>
  <div class="history-transaction" v-loading="loading">
    <el-table
      :data="history"
      style="width: 100%; height: 100%; overflow: auto"
      ref="historyTable"
      v-infinite-scroll="fetchNext"
      infinite-scroll-immediate="false"
      :infinite-scroll-disabled="infiniteLoading || noMore"
    >
      <el-table-column :label="$t('message.nonce')" :width="100">
        <template slot-scope="scope">
          {{ scope.row.nonce }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.method')">
        <template slot-scope="scope">
          {{ showTxMethod(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.balance')">
        <template slot-scope="scope">
          {{ showTxTokenAmount(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.executionDate')">
        <template slot-scope="scope">
          {{ scope.row.executionDate }}
        </template>
      </el-table-column>
      <el-table-column :width="80">
        <template slot-scope="scope">
          <span>{{
            scope.row.isSuccessful
              ? $t("message.success")
              : scope.row.isExecuted
              ? $t("message.fail")
              : "- -"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="scope">
          <div style="white-space: pre-wrap">
            {{ JSON.stringify(scope.row, null, 2) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="infiniteLoading" class="loading-wrapper">
      <i class="el-icon-loading"></i>
      <span>{{ $t("message.loading") }}...</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { CHAIN_DECIMALS, CHAIN_SYMBOL } from "@/js/constant";
import axios from "axios";

export default {
  name: "HistoryTransaction",
  computed: {
    ...mapGetters(["signer", "apiKit", "safeKit", "safeAccount", "chainId"]),
  },
  data() {
    return {
      loading: false,
      history: [],
      next: null,
      infiniteLoading: false, // 防止重复加载
      noMore: false, // 数据是否全部加载完毕
    };
  },
  async mounted() {
    if (!this.signer) {
      this.$message.error(this.$t("message.pleaseConnectWallet"));
      this.$router.push("/");
      return;
    }
    this.loading = true;
    try {
      const res = await this.apiKit.getAllTransactions(this.safeAccount);
      this.history = res.results;
      this.next = res.next;
    } catch (error) {
      this.$message.error(error.message || error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchNext() {
      if (this.infiniteLoading || this.noMore || !this.next) return;
      this.infiniteLoading = true;
      try {
        const res = await axios.get(this.next);
        const newData = res.data.results || [];
        if (newData.length === 0) {
          this.noMore = true;
          return;
        }
        this.next = res.data.next;
        this.history = this.history.concat(newData);
      } catch (error) {
        this.$message.error(error.message || error);
      } finally {
        this.infiniteLoading = false;
      }
    },
    showTxTokenAmount(tx) {
      const { transfers, value, to } = tx;
      if (transfers?.length > 0) {
        // const { to, tokenInfo, value } = transfers[0];
        const transfer = transfers[0];
        if (transfer.tokenInfo) {
          if (transfer.to == this.safeAccount) {
            return `${new BigNumber(transfer.value)
              .div(10 ** transfer.tokenInfo.decimals)
              .toString()} ${transfer.tokenInfo.symbol}`;
          } else {
            return `-${new BigNumber(transfer.value)
              .div(10 ** transfer.tokenInfo.decimals)
              .toString()} ${transfer.tokenInfo.symbol}`;
          }
        }
        const decimals = CHAIN_DECIMALS[this.chainId] || 18;
        const symbol = CHAIN_SYMBOL[this.chainId] || "NATIVE TOKEN";
        if (transfer.to == this.safeAccount) {
          return `${new BigNumber(transfer.value)
            .div(10 ** decimals)
            .toString()} ${symbol}`;
        } else {
          return `-${new BigNumber(transfer.value)
            .div(10 ** decimals)
            .toString()} ${symbol}`;
        }
      }
      if (value == "0") return "- -";
      const decimals = CHAIN_DECIMALS[this.chainId] || 18;
      const symbol = CHAIN_SYMBOL[this.chainId] || "NATIVE TOKEN";
      if (to == this.safeAccount) {
        return `${new BigNumber(value)
          .div(10 ** decimals)
          .toString()} ${symbol}`;
      } else {
        return `-${new BigNumber(value)
          .div(10 ** decimals)
          .toString()} ${symbol}`;
      }
    },
    showTxMethod(tx) {
      const { transfers, dataDecoded, data } = tx;
      if (dataDecoded) {
        return dataDecoded.method;
      } else if (transfers) {
        if (transfers[0]?.to == this.safeAccount) {
          return "receive";
        } else if (transfers[0]?.from == this.safeAccount) {
          return "send";
        }
      }
      if (data) {
        return "contract interaction";
      }
      if (Number(tx.value) > 0) {
        return "send";
      }
      return "on-chain rejection";
    },
  },
};
</script>

<style>
.history-transaction {
  height: calc(100%);
  overflow: auto;
}
</style>
