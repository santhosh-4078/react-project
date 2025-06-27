// src/services/authService.ts
import axios from "./axiosInstance";
import { APICONSTANT } from "./config";

export const login = async (payload: { email: string; password: string }) => {
  const res = await axios.post(APICONSTANT.LOGIN, payload);
  return res.data;
};

export const fetchUserProfile = async () => {
  const res = await axios.get(APICONSTANT.PROFILE);
  return res.data;
};