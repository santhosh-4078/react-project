// src/services/axiosInstance.ts
import axios from "axios";
import { APIURLS } from "./config";

const axiosInstance = axios.create({
  baseURL: APIURLS.baseUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-access-token"] = token;
    // Optionally also: config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. You may want to redirect or logout.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;