<template>
  <div v-if="visible" id="transaction-operate" class="transaction-operate">
    <div style="display: flex; justify-content: end">
      <img
        @click="close"
        style="
          width: 40px;
          margin-right: 40px;
          margin-top: 20px;
          cursor: pointer;
        "
        src="@/assets/fork.svg"
        alt=""
      />
    </div>
    <div class="content" style="margin-top: 50px">
      <div class="content-item">
        <createTransaction
          v-if="active == steps.create"
          :type="createType"
          :data="createData"
          :updateTx="updateTx"
          :close="close"
          :followUp="nextConfirm"
        ></createTransaction>
        <confirm-transaction
          v-if="active == steps.confirm"
          :tx="tx"
          :updateTx="updateTx"
          :close="close"
          :followUp="followUp"
        ></confirm-transaction>
        <executeTransaction
          v-if="active == steps.execute"
          :tx="tx"
          :close="close"
          :followUp="followUp"
        ></executeTransaction>
      </div>
      <div style="width: 200px; height: 300px">
        <el-steps direction="vertical" :active="active">
          <el-step :title="$t('message.create')"></el-step>
          <el-step :title="$t('message.confirm')"></el-step>
          <el-step :title="$t('message.execute')"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
import { dealWithTxSteps } from "@/js/constant";
import confirmTransaction from "./confirmTransaction.vue";
import executeTransaction from "./executeTransaction.vue";
import createTransaction from "./createTransaction.vue";
import _ from "lodash";

export default {
  name: "NewTransaction",
  data() {
    return {
      visible: false,
      tx: {},
      active: 0,
      steps: dealWithTxSteps,
      followUp: () => {},
      createType: "transfer",
      createData: {},
    };
  },
  components: {
    confirmTransaction,
    executeTransaction,
    createTransaction,
  },
  methods: {
    nextConfirm() {
      this.active = this.steps.confirm;
    },
    updateTx(tx) {
      this.tx = _.cloneDeep(tx);
    },
    create(type, data, followUp) {
      this.visible = true;
      this.active = this.steps.create;
      this.followUp = followUp;
      this.createType = type;
      this.createData = data;
    },
    confirm(tx, followUp) {
      this.visible = true;
      this.tx = tx;
      this.active = this.steps.confirm;
      this.followUp = followUp;
    },
    execute(tx, followUp) {
      this.visible = true;
      this.tx = tx;
      this.active = this.steps.execute;
      this.followUp = followUp;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.transaction-operate {
  position: absolute;
  top: 0px;
  height: 100%;
  width: 100%;
  background: #fff;
  .content {
    width: 100%;
    display: flex;
    .content-item {
      flex: 1;
    }
  }
}
</style>
