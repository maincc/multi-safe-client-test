<template>
  <div class="web-top">
    <div>
      <span v-if="chainId">{{ $t("message.chainId") }}: {{ chainId }}</span>
      <el-button v-if="signer" class="connectBtn" style="margin-left: 10px">
        {{ signer.slice(0, 6) + "..." + signer.slice(-4) }}
      </el-button>
      <el-button
        v-else
        class="connectBtn"
        style="margin-left: 10px"
        type="primary"
        @click="connectWallet"
      >
        {{ $t("message.connectWallet") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SafeApiKit from "@safe-global/api-kit";

export default {
  name: "WebHarder",
  mounted() {
    try {
      const ethereum = window.ethereum;
      if (ethereum) {
        ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            this.$store.dispatch("setSigner", null);
            if (this.$route.path !== "/welcome") {
              this.$router.push("/welcome");
            }
          } else {
            this.$store.dispatch("setSigner", accounts[0]);
            if (this.safeKit) {
              this.safeKit.isOwner(accounts[0]).then((isOwner) => {
                if (!isOwner) {
                  if (this.$route.path !== "/welcome/accounts") {
                    this.$router.push("/welcome/accounts");
                  }
                } else {
                  this.safeKit
                    .connect({
                      signer: accounts[0],
                    })
                    .then((newSafeKit) => {
                      this.$store.dispatch("setSafeKit", newSafeKit);
                    });
                }
              });
            }
          }
        });
        ethereum.on("chainChanged", (chainId) => {
          this.$store.dispatch("setChainId", parseInt(chainId, 16));
        });
      } else {
        this.$message.error(this.$t("message.notInstallMetaMask"));
      }
    } catch (error) {
      this.$message.error(error);
    }
  },
  computed: {
    ...mapGetters(["chainId", "signer", "apiKit", "safeKit"]),
  },
  watch: {
    async signer(val) {
      await this.getSafesOfOwner(val, this.apiKit);
    },
    async apiKit(val) {
      await this.getSafesOfOwner(this.signer, val);
    },
  },
  methods: {
    async getSafesOfOwner(signer, apiKit) {
      if (signer && apiKit) {
        const res = await apiKit.getSafesByOwner(signer);
        this.$store.dispatch("setSafesOfSigner", res.safes);
      }
    },
    async connectWallet() {
      const ethereum = window.ethereum;
      if (ethereum) {
        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          this.$store.dispatch("setSigner", accounts[0]);
          const chainId = await ethereum.request({ method: "eth_chainId" });
          this.$store.dispatch("setChainId", parseInt(chainId, 16));
          if (this.$route.path !== "/welcome/accounts") {
            this.$router.push("/welcome/accounts");
          }
        } catch (error) {
          this.$message.error(error);
        }
      } else {
        this.$message.error(this.$t("message.notInstallMetaMask"));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.web-top {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  .connectBtn {
    height: 38px;
    border-radius: 25px;
  }
}
</style>
