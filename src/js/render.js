import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import VueI18n from "vue-i18n";

import VueClipBoard from "vue-clipboard2";
Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.use(VueClipBoard);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "zh", // set locale
  messages: {
    en: {
      message: require("@/i18n/en.json"),
    },
    zh: {
      message: require("@/i18n/zh.json"),
    },
  },
});

const render = ({ component, store }) => {
  const v = new Vue({
    i18n,
    store,
    render(createElement) {
      return createElement(component);
    },
  });

  return v;
};

const createRoot = ({ router, store, root }) => {
  return new Vue({
    el: "#app",
    router,
    store,
    i18n,
    components: { App: root },
    render: (h) => h(root), // 替换 template: "<App/>"
  });
};

export { createRoot, render, i18n };
