const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/";

export const APIURLS = {
  baseUrl: BASE_URL.endsWith("v1/") ? BASE_URL : BASE_URL + "v1/",
  imageUrl: BASE_URL,
};

export const APPCONFIG = {
  name: "Friends Project",
  appMode: import.meta.env.MODE || "development",
};

export const APICONSTANT = {
  LOGIN: "auth/login",
  STUDENTS: "students",
  PROFILE: "auth/profile",
  viewUsers: "admin/cuisine",
} as const

export type APIKeys = keyof typeof APICONSTANT;