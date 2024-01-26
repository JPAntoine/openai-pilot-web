import axios, { AxiosRequestConfig } from "axios";

const apiConfig: AxiosRequestConfig = {
  baseURL: "", //globalThis?.app?.env?.VITE_BACKEND_BASE_URL,
  headers: {
    Accept: "Application/json",
    "Content-Type": "Application/json",
  },
};

export const baseAxiosInstance = axios.create(apiConfig);

baseAxiosInstance.interceptors.request.use(
  (config) => {
    // Modify or add to config (e.g., add auth token)
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

baseAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Handle responses outside the range of 2xx
    return Promise.reject(error);
  }
);
