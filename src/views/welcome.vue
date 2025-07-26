<template>
  <div>
    <h1>{{ $t("message.start") }}</h1>
    <p>{{ $t("message.startExplain") }}</p>
    <p>{{ $t("message.pleaseConnectWallet") }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "welcome",
};
</script>

<style></style>
