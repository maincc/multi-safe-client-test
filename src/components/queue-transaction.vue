<template>
  <div class="queue-transaction" v-loading="loading">
    <el-table
      :data="queue"
      style="width: 100%; height: 100%; overflow: auto"
      ref="queueTable"
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
          {{ tokenAmounts[scope.$index] }}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          {{
            $t("message.numOfSignatures", {
              num: scope.row.confirmations.length,
              need: scope.row.confirmationsRequired,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button
            v-if="canExecute(scope.row)"
            @click="executeTx(scope.row)"
            class="confirm-btn"
            >{{ $t("message.execute") }}</el-button
          >
          <el-button
            v-else
            @click="confirmTx(scope.row)"
            :disabled="!canOperate(scope.row)"
            :class="
              canOperate(scope.row) ? 'confirm-btn' : 'disabled-confirm-btn'
            "
            >{{ $t("message.confirm") }}</el-button
          >
        </template>
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="scope">
          <div>
            <el-button @click="rejectTx(scope.row)" type="primary"
              >reject</el-button
            >
            <div style="white-space: pre-wrap">
              {{ JSON.stringify(scope.row, null, 2) }}
            </div>
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
import transactionOperate from "@/components/transaction-operate";

export default {
  name: "QueueTransaction",
  props: {
    changeHistory: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters([
      "signer",
      "apiKit",
      "safeKit",
      "safeAccount",
      "chainId",
      "safeInfo",
    ]),
  },
  data() {
    return {
      loading: false,
      queue: [],
      next: null,
      infiniteLoading: false, // 防止重复加载
      noMore: false, // 数据是否全部加载完毕
      tokenAmounts: [],
      isShow: false,
    };
  },
  async mounted() {
    if (!this.signer) {
      this.$message.error(this.$t("message.pleaseConnectWallet"));
      this.$router.push("/");
      return;
    }
    await this.fetchPendingTx();
  },
  destroyed() {
    transactionOperate().close();
  },
  methods: {
    rejectTx(tx) {
      transactionOperate().create(
        "rejectTx",
        {
          nonce: tx.nonce,
        },
        async () => {
          await this.fetchPendingTx();
        }
      );
    },
    executeTx(tx) {
      transactionOperate().execute(tx, () => {
        this.changeHistory();
      });
    },
    confirmTx(tx) {
      transactionOperate().confirm(tx, this.fetchPendingTx);
    },
    async fetchPendingTx() {
      this.loading = true;
      try {
        const res = await this.apiKit.getPendingTransactions(this.safeAccount);
        this.queue = res.results;
        for (const tx of this.queue) {
          const { to, dataDecoded } = tx;
          if (dataDecoded) {
            if (dataDecoded.method == "transfer") {
              const tokenInfo = await this.apiKit.getToken(to);
              this.tokenAmounts.push(
                `-${new BigNumber(dataDecoded.parameters[1].value)
                  .div(new BigNumber(10).pow(tokenInfo.decimals))
                  .toNumber()} ${tokenInfo.symbol}`
              );
            } else {
              this.tokenAmounts.push("- -");
            }
          } else {
            const { value } = tx;
            if (value != 0) {
              const decimals = CHAIN_DECIMALS[this.chainId] || 18;
              const symbol = CHAIN_SYMBOL[this.chainId] || "NATIVE TOKEN";
              this.tokenAmounts.push(
                `-${new BigNumber(value)
                  .div(new BigNumber(10).pow(decimals))
                  .toNumber()} ${symbol}`
              );
            } else {
              this.tokenAmounts.push("- -");
            }
          }
        }
        this.next = res.next;
      } catch (error) {
        this.$message.error(error.message || error);
      } finally {
        this.loading = false;
      }
    },
    canOperate(tx) {
      const { confirmations } = tx;
      return !confirmations.find((confirmation) => {
        return confirmation.owner == this.signer;
      });
    },
    canExecute(tx) {
      const { confirmations } = tx;
      const { threshold, owners } = this.safeInfo;
      let haveConfirm = 0;
      confirmations.forEach((confirm) => {
        if (
          owners.find((owner) => {
            return owner == confirm.owner;
          })
        ) {
          haveConfirm++;
        }
      });
      if (haveConfirm >= threshold) {
        return true;
      }
      return false;
    },
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
        this.queue = this.queue.concat(newData);
      } catch (error) {
        this.$message.error(error.message || error);
      } finally {
        this.infiniteLoading = false;
      }
    },
    showTxMethod(tx) {
      if (tx.value == 0) {
        if (tx.dataDecoded) {
          if (tx.dataDecoded.method == "transfer") {
            return "send";
          } else {
            return tx.dataDecoded.method;
          }
        } else {
          return "on-chain rejection";
        }
      }
      return "send";
    },
  },
};
</script>

<style lang="scss" scoped>
.queue-transaction {
  height: calc(100%);
  overflow: auto;
  .confirm-btn {
    border: 2px solid #121312;
    color: #121312;
  }
  .disabled-confirm-btn {
    border: 2px solid #999;
    color: #999;
  }
}
</style>
