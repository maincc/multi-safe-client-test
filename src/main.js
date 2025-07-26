import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { createRoot } from "./js/render";

import "./css/table.scss";

Vue.config.productionTip = false;

createRoot({ store, router, root: App });
