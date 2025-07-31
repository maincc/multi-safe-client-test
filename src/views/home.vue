<template>
  <div class="home">
    <div class="info" v-loading="infoLoading" style="margin-top: 30px">
      <h2>Safe Address</h2>
      <p>{{ safeAccount }}</p>
      <h2>Safe Info</h2>
      <div style="display: flex; justify-content: center">
        <p v-if="info">Threshold: {{ info.threshold }}</p>
        <i
          @click="changeThreshold"
          style="margin-left: 10px; cursor: pointer"
          class="el-icon-refresh"
        ></i>
      </div>
      <div v-if="info">
        <div v-for="(item, index) in info.owners" :key="index">
          <div style="display: flex; justify-content: center">
            <p>Owner {{ index + 1 }}: {{ item }}</p>
            <i
              @click="changeOwner(index)"
              style="margin-left: 10px; cursor: pointer"
              class="el-icon-refresh"
            ></i>
            <i
              @click="deleteOwner(index)"
              style="margin-left: 10px; cursor: pointer"
              class="el-icon-delete"
            ></i>
          </div>
        </div>
      </div>
      <i
        style="cursor: pointer"
        @click="addOwner"
        class="el-icon-circle-plus-outline"
      ></i>
      <p v-if="info">version: {{ info.version }}</p>
      <p v-if="info">nonce: {{ info.nonce }}</p>
      <div style="display: flex; justify-content: center">
        <p v-if="info">guard: {{ haveGuard ? info.guard : "- -" }}</p>
        <i
          v-if="haveGuard"
          @click="removeGuard"
          style="margin-left: 10px; cursor: pointer"
          class="el-icon-delete"
        ></i>
        <i
          v-else
          @click="addGuard"
          style="margin-left: 10px; cursor: pointer"
          class="el-icon-circle-plus-outline"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import transactionOperate from "@/components/transaction-operate";

export default {
  name: "home",
  data() {
    return {
      info: null,
      infoLoading: false,
    };
  },
  computed: {
    ...mapGetters(["signer", "apiKit", "safeKit", "safeAccount"]),
    haveGuard() {
      return (
        this.info &&
        this.info.guard !== "0x0000000000000000000000000000000000000000"
      );
    },
  },
  async mounted() {
    if (this.apiKit) {
      this.infoLoading = true;
      try {
        const info = await this.apiKit.getSafeInfo(this.safeAccount);
        this.info = info;
        this.$store.dispatch("setSafeInfo", info);
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.infoLoading = false;
      }
    } else {
      this.$router.push("/");
    }
  },
  destroyed() {
    transactionOperate().close();
  },
  methods: {
    removeGuard() {
      transactionOperate().create(
        "disableGuard",
        {
          removeGuard: this.info.guard,
        },
        () => {
          this.$router.push("/transaction");
        }
      );
    },
    addGuard() {
      transactionOperate().create("enableGuard", {}, () => {
        this.$router.push("/transaction");
      });
    },
    deleteOwner(index) {
      transactionOperate().create(
        "removeOwner",
        {
          removeOwner: this.info.owners[index],
          threshold: this.info.threshold,
          maxThreshold: this.info.owners.length - 1,
        },
        () => {
          this.$router.push("/transaction");
        }
      );
    },
    changeOwner(index) {
      transactionOperate().create(
        "swapOwner",
        {
          oldOwner: this.info.owners[index],
        },
        () => {
          this.$router.push("/transaction");
        }
      );
    },
    addOwner() {
      transactionOperate().create(
        "addOwner",
        {
          threshold: this.info.threshold,
          maxThreshold: this.info.owners.length,
        },
        () => {
          this.$router.push("/transaction");
        }
      );
    },
    changeThreshold() {
      transactionOperate().create(
        "changeThreshold",
        {
          threshold: this.info.threshold,
          maxThreshold: this.info.owners.length,
        },
        () => {
          this.$router.push("/transaction");
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
