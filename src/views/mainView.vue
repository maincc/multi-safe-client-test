<template>
  <div class="mainView">
    <div class="main-left">
      <div style="margin: 10px 0px">
        <span>
          {{ $t("message.account") }}:
          {{
            safeAccount
              ? safeAccount.slice(0, 6) + "..." + safeAccount.slice(-4)
              : "- -"
          }}
        </span>
      </div>
      <div class="menus" style="margin-top: 30px">
        <div
          :style="{ background: item.path == $route.path ? '#eee' : '' }"
          class="menus-item"
          v-for="(item, index) in menus"
          :key="index"
          @click="toPath(item.path)"
        >
          <span>{{ item.meta.title }}</span>
        </div>
      </div>
    </div>
    <div class="main-right" id="main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Safe from "@safe-global/protocol-kit";
import { routes } from "@/router";

export default {
  name: "mainView",
  computed: {
    ...mapGetters(["signer", "safeAccount"]),
  },
  data() {
    return {
      menus: [],
    };
  },
  async mounted() {
    try {
      const route = routes.find((route) =>
        route.meta ? route.meta.isMenu : false
      );
      this.menus = route.children.filter((item) => !item.meta.showMenu);
      const safeKit = await Safe.init({
        provider: window.ethereum,
        signer: this.signer,
        safeAddress: this.safeAccount,
      });
      this.$store.dispatch("setSafeKit", safeKit);
    } catch (error) {
      this.$message.error(error.message);
    }
  },
  methods: {
    toPath(path) {
      if (path == this.$route.path) return;
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
.mainView {
  width: 100%;
  height: 100%;
  display: flex;
  .main-left {
    width: 200px;
    height: 100%;
    border-right: 1px solid #eee;
    .menus {
      .menus-item {
        border-top: 1px solid #eee;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
      }
    }
  }
  .main-right {
    flex: 1;
    height: 100%;
    position: relative;
  }
}
</style>
