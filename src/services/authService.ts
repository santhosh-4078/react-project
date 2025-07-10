import axios from "./axiosInstance";
import { APIURLS } from "./config";

// interface LoginPayload {
//   email: string;
//   password: string;
//   role: string;
//   rememberMe: boolean;
// }

interface LoginPayload {
  email_id: string;
  password: string;
}

export const setToken = (token: string, userId?: string) => {
  localStorage.setItem("token", token);
  if (userId) {
    localStorage.setItem("user_id", userId);
  }
};

export const getToken = () => localStorage.getItem("token");

export const getUserId = () => localStorage.getItem("user_id");

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
};

export const loginApiMethod = async (payload: {
  url: { apiUrl: string };
  body: LoginPayload;
}) => {
  const api = APIURLS.baseUrl + payload.url.apiUrl;

  const response = await axios.post(api, payload.body);

  return response.data;
};