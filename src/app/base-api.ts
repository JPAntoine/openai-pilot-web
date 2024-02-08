import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getToken } from "./msalinstance";
import { RetryTimes } from "./constants";
import { AppDispatch } from "./store";
import { useDispatch } from "react-redux";
import { setRetryAttempt } from "@/features/chatbox/slices/retrySlice";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  __retryCount?: number; // Custom property to track retry count
}

const apiConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    Accept: "Application/json",
    "Content-Type": "Application/json",
  },
};

export const baseAxiosInstance = axios.create(apiConfig);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

baseAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const dispatch: AppDispatch = useDispatch();
    const config = error.config as CustomAxiosRequestConfig; // Cast config to our custom interface

    // Check for retry-able status codes, e.g., 503
    if (
      !config ||
      !error.response ||
      ![503].includes(error.response.status) ||
      (config.__retryCount ?? 0) >= RetryTimes.MAX_RETRY_DURATION
    ) {
      return Promise.reject(error);
    }

    config.__retryCount = (config.__retryCount || 0) + 1;
    dispatch(setRetryAttempt(config.__retryCount));    

    let retryDelay = RetryTimes.BASE_DELAY * Math.pow(2, config.__retryCount);
    retryDelay = Math.min(retryDelay, RetryTimes.UNAVAILABLE_ERROR_WAIT_TIME);

    await delay(retryDelay);

    return baseAxiosInstance(config);
  }
);
