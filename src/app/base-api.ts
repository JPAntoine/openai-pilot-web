import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "./msalinstance";

const apiConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    Accept: "Application/json",
    "Content-Type": "Application/json",
  },
};

export const baseAxiosInstance = axios.create(apiConfig);

baseAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken(); 
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);