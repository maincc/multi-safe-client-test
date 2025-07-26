<template>
  <div class="accounts">
    <div class="accounts__list" style="margin-top: 30px">
      <div class="accounts__list__header">
        <span>{{ $t("message.account") }}</span>
        <el-button @click="create()" type="primary">{{
          $t("message.createAccount")
        }}</el-button>
      </div>
      <div class="accounts__list__body" v-loading="accountsLoading">
        <div
          @click="setAccount(safe)"
          class="accounts__list__body__item"
          v-for="(safe, index) in safesOfSigner"
          :key="index"
        >
          <span>{{ safe }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Accounts",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["safesOfSigner", "chainId", "signer"]),
    accountsLoading() {
      if (this.chainId && this.signer && this.safesOfSigner.length > 0) {
        return false;
      } else if (this.chainId && this.signer) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    create() {
      this.$router.push("/create");
    },
    setAccount(safe) {
      this.$store.dispatch("setSafeAccount", safe);
      this.$router.push("/home");
    },
  },
};
</script>

<style lang="scss" scoped>
.accounts {
  display: flex;
  justify-content: center;
  .accounts__list {
    width: 600px;
    .accounts__list__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .accounts__list__body {
      margin-top: 20px;
      min-height: 200px;
      border: 1px solid #ddd;
      .accounts__list__body__item {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
