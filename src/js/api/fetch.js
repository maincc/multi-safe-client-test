import axios from "axios";
import Response from "./response/";
import ApiError from "./response/api-error";
import router from "@/router";
import { Message } from "element-ui";
import { i18n } from "../render";

const service = axios.create({
  baseURL: "https://safe-client.safe.global",
});

service.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  async (response) => {
    let res;
    try {
      res = response.data;
      return res;
    } catch (error) {
      return Promise.reject(new ApiError(res.message, res.code, res.data));
    }
  },
  (err) => {
    if (err.response) {
      const { status, data } = err.response;
      return Promise.reject(
        new ApiError(data.message, data.code || status, data)
      );
    } else {
      // 网络错误或请求未发出（如 CORS、超时等）
      return Promise.reject(new ApiError(err.message, 901));
    }
  }
);

export default service;
