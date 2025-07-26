<template>
  <div class="transaction">
    <div style="margin-top: 30px" class="tx-top">
      <div
        @click="is = 'queue'"
        :style="{ borderBottom: is == 'queue' ? '2px solid #00D6B4' : 'none' }"
        class="tx-top-item"
      >
        {{ $t("message.queue") }}
      </div>
      <div
        @click="is = 'history'"
        :style="{
          borderBottom: is == 'history' ? '2px solid #00D6B4' : 'none',
        }"
        class="tx-top-item"
      >
        {{ $t("message.history") }}
      </div>
    </div>
    <component :is="is" :changeHistory="changeHistory"></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import queue from "@/components/queue-transaction.vue";
import history from "@/components/history-transaction.vue";

export default {
  name: "transaction",
  computed: {
    ...mapGetters(["signer", "apiKit", "safeKit", "safeAccount"]),
  },
  data() {
    return {
      is: "queue",
    };
  },
  components: {
    queue,
    history,
  },
  methods: {
    changeHistory() {
      this.is = "history";
    },
  },
};
</script>

<style lang="scss" scoped>
.transaction {
  height: calc(100% - 60px);
  .tx-top {
    display: flex;
    align-items: center;
    .tx-top-item {
      width: 100px;
      cursor: pointer;
    }
  }
}
</style>
