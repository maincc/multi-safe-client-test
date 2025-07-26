<template>
  <div class="home">
    <div class="info" v-loading="infoLoading" style="margin-top: 30px">
      <h2>Safe Address</h2>
      <p>{{ safeAccount }}</p>
      <h2>Safe Info</h2>
      <p v-if="info">Threshold: {{ info.threshold }}</p>
      <div v-if="info">
        <div v-for="(item, index) in info.owners" :key="index">
          <p>Owner {{ index + 1 }}: {{ item }}</p>
        </div>
      </div>
      <p v-if="info">version: {{ info.version }}</p>
      <p v-if="info">nonce: {{ info.nonce }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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
};
</script>

<style lang="scss" scoped></style>
