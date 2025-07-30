<template>
  <div class="newTransaction">
    <h1 style="margin-top: 30px">{{ $t("message.createTransaction") }}</h1>
    <h3 style="margin-top: 10px">{{ $t("message.manageAssets") }}</h3>
    <el-button style="margin-top: 5px" @click="toAssets" type="primary">{{
      $t("message.sendToken")
    }}</el-button>
    <h3 style="margin-top: 10px">{{ $t("message.newTransaction") }}</h3>
    <el-button style="margin-top: 5px" @click="Builder" type="primary">{{
      $t("message.transactionBuilder")
    }}</el-button>
  </div>
</template>

<script>
import transactionOperate from "@/components/transaction-operate";

export default {
  name: "newTransaction",
  destroyed() {
    transactionOperate().close();
  },
  methods: {
    async toAssets() {
      this.$router.push("/assets");
    },
    Builder() {
      transactionOperate().create("builder", {}, () => {
        this.$router.push("/transaction");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
