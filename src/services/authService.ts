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

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const loginApiMethod = async (payload: {
  url: { apiUrl: string };
  body: LoginPayload;
}) => {
  const api = APIURLS.baseUrl + payload.url.apiUrl;

  const response = await axios.post(api, payload.body);

  return response.data;
};