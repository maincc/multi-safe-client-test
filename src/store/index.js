import Vue from "vue";
import Vuex from "vuex";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import Web3 from "web3";
import { apiKey } from "@/js/constant";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    chainId: null,
    signer: null,
    safeAccount: null,
    safesOfSigner: [],
    safeKit: null,
    safeInfo: null,
  },
  getters: {
    chainId: (state) => state.chainId,
    signer: (state) => state.signer,
    apiKit: (state) => {
      if (!state.chainId) return null;
      return new SafeApiKit({
        chainId: BigInt(state.chainId),
        apiKey: apiKey,
      });
    },
    safeAccount: (state) => state.safeAccount,
    safesOfSigner: (state) => state.safesOfSigner,
    safeKit: (state) => state.safeKit,
    safeInfo: (state) => state.safeInfo,
  },
  mutations: {
    SET_CHAIN_ID(state, chainId) {
      Vue.set(state, "chainId", chainId);
    },
    SET_SIGNER(state, signer) {
      Vue.set(state, "signer", signer);
    },
    SET_SAFE_ACCOUNT(state, safeAccount) {
      Vue.set(state, "safeAccount", safeAccount);
    },
    SET_SAFES_OF_SIGNER(state, safesOfSigner) {
      Vue.set(state, "safesOfSigner", safesOfSigner);
    },
    SET_SAFE_KIT(state, safeKit) {
      Vue.set(state, "safeKit", safeKit);
    },
    SET_SAFE_INFO(state, safeInfo) {
      Vue.set(state, "safeInfo", safeInfo);
    },
  },
  actions: {
    setChainId: ({ commit }, chainId) => commit("SET_CHAIN_ID", chainId),
    setSigner: ({ commit }, address) =>
      commit(
        "SET_SIGNER",
        address ? Web3.utils.toChecksumAddress(address) : ""
      ),
    setSafeAccount: ({ commit }, address) =>
      commit(
        "SET_SAFE_ACCOUNT",
        address ? Web3.utils.toChecksumAddress(address) : ""
      ),
    setSafesOfSigner: ({ commit }, safesOfSigner) =>
      commit("SET_SAFES_OF_SIGNER", safesOfSigner),
    setSafeKit: ({ commit }, safeKit) => commit("SET_SAFE_KIT", safeKit),
    setSafeInfo: ({ commit }, safeInfo) => commit("SET_SAFE_INFO", safeInfo),
  },
  modules: {},
});
