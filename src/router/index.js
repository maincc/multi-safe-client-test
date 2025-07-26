import Vue from "vue";
import VueRouter from "vue-router";
import _import from "./import-component";
import { i18n } from "@/js/render";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    redirect: "/welcome",
  },
  {
    path: "/welcome",
    name: "welcome",
    component: _import("welcome"),
  },
  {
    path: "/welcome/accounts",
    name: "accounts",
    component: _import("accounts"),
  },
  {
    path: "/create",
    name: "create",
    component: _import("create"),
  },
  {
    path: "/main",
    name: "main",
    redirect: "/home",
    component: _import("mainView"),
    meta: { isMenu: true },
    children: [
      {
        path: "/home",
        name: "home",
        component: _import("home"),
        meta: {
          showMenu: false,
          title: i18n.t("message.home"),
        },
      },
      {
        path: "/assets",
        name: "assets",
        component: _import("assets"),
        meta: {
          showMenu: false,
          title: i18n.t("message.assets"),
        },
      },
      {
        path: "/transaction",
        name: "transaction",
        component: _import("transaction"),
        meta: {
          showMenu: false,
          title: i18n.t("message.transaction"),
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
