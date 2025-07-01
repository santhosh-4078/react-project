// src/services/axiosInstance.ts
import axios from "axios";
import { APIURLS } from "./config";

const axiosInstance = axios.create({
  baseURL: APIURLS.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // if (token) {
  //   config.headers["Authorization"] = `Bearer ${token}`;
  // }
  if (token) {
    config.headers["x-access-token"] = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized");
      // Optional: logout or redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;