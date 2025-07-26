<template>
  <div class="create" v-loading="loading">
    <div class="getInfo">
      <div class="getInfo-item">
        <div class="left">
          {{ $t("message.chainId") }}
        </div>
        <div class="right">
          {{ chainId || "0x0" }}
        </div>
      </div>
      <div v-for="(item, index) in owners" :key="index" class="getInfo-item">
        <div class="left">
          {{ $t("message.owner") + (index + 1) }}
        </div>
        <div class="right">
          <el-input
            style="width: 400px"
            v-model="owners[index]"
            :placeholder="$t('message.pleaseEnterAddress')"
          ></el-input>
        </div>
      </div>
      <el-button
        style="margin-bottom: 20px"
        @click="owners.push('')"
        type="primary"
        >{{ $t("message.add") }}</el-button
      >
      <div class="getInfo-item">
        <div class="left">
          {{ $t("message.Threshold") }}
        </div>
        <div class="right">
          <el-input-number
            v-model="threshold"
            :min="1"
            :max="owners.length"
            label="描述文字"
          ></el-input-number>
        </div>
      </div>
      <div class="getInfo-item">
        <div class="left">salt-nonce(可选):</div>
        <div class="right">
          <el-input
            style="width: 400px"
            type="number"
            v-model.number="saltNonce"
            :placeholder="$t('message.pleaseEnterSaltNonce')"
          ></el-input>
        </div>
      </div>
      <el-button @click="generate()" :disabled="!isGenerate" type="primary">{{
        $t("message.generate")
      }}</el-button>
    </div>
    <div class="result" style="margin-top: 30px">
      <div v-if="tx" class="result-content" style="margin-top: 30px">
        <p>{{ $t("message.account") }}: {{ account }}</p>
        <p>tx.to: {{ tx.to }}</p>
        <p>tx.data: {{ tx.data }}</p>
        <p>tx.value: {{ tx.value }}</p>
      </div>
      <el-button v-if="tx" @click="deploy()" type="primary">{{
        $t("message.deploy")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Safe from "@safe-global/protocol-kit";
import { BigNumber } from "bignumber.js";

export default {
  name: "createView",
  computed: {
    ...mapGetters(["signer", "chainId", "apiKit"]),
    isGenerate() {
      return (
        this.owners.length > 0 &&
        this.threshold > 0 &&
        this.threshold <= this.owners.length &&
        this.owners.every((owner) => owner != null && owner != "")
      );
    },
  },
  mounted() {
    if (!this.signer) {
      this.$router.push("/");
    }
    this.owners.push(this.signer);
  },
  data() {
    return {
      owners: [],
      saltNonce: null,
      threshold: 1,
      safeNonce: null,
      safeKit: null,
      account: null,
      loading: false,
      tx: null,
    };
  },
  methods: {
    async generate() {
      this.loading = true;
      try {
        const predictedSafe = {
          safeAccountConfig: {
            owners: this.owners,
            threshold: this.threshold,
          },
        };
        if (this.saltNonce) {
          predictedSafe.safeDeploymentConfig = {
            ...predictedSafe.safeDeploymentConfig,
            saltNonce: this.saltNonce,
          };
        }
        this.safeKit = await Safe.init({
          provider: window.ethereum,
          signer: this.signer,
          predictedSafe,
        });
        this.account = await this.safeKit.getAddress();
        this.tx = await this.safeKit.createSafeDeploymentTransaction();
        console.log(this.tx);
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    async deploy() {
      this.loading = true;
      try {
        const walletClient = await this.safeKit
          .getSafeProvider()
          .getExternalSigner();
        const txHash = await walletClient.sendTransaction({
          to: this.tx.to,
          value: BigInt(this.tx.value),
          data: this.tx.data,
        });
        const privateClient = await this.safeKit
          .getSafeProvider()
          .getExternalProvider();
        const transactionReceipt =
          await privateClient.waitForTransactionReceipt({
            hash: txHash,
          });
        if (transactionReceipt.status == "success") {
          const kit = await this.safeKit.connect({
            safeAddress: this.account,
          });
          if (await kit.isSafeDeployed()) {
            this.$message.success("deploy success");
            this.$store.dispatch("setSafeKit", kit);
            this.$store.dispatch("setSafeAccount", this.account);
            this.$router.push("/home");
          } else {
            this.$message.error("deploy fail");
          }
        } else {
          this.$message.error("deploy fail");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("deploy fail");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create {
  .getInfo {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .getInfo-item {
      width: 600px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .left {
        font-size: 16px;
        font-weight: 600;
      }
      .right {
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
  .result {
    border-top: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    .result-content {
      width: 600px;
      word-wrap: break-word;
      text-align: left;
    }
  }
}
</style>
