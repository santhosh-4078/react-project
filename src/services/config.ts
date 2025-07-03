const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/";

export const APIURLS = {
  // baseUrl: BASE_URL.endsWith("v1/") ? BASE_URL : BASE_URL + "v1/",
  baseUrl: BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/",
  imageUrl: BASE_URL,
};

export const APPCONFIG = {
  name: "Friends Project",
  appMode: import.meta.env.MODE || "development",
};

export const APICONSTANT = {
  LOGIN: "api/users/verifylogin",
  STUDENTS: "students",
  PROFILE: "auth/profile",
  GET_INSTRUCTOR: "api/users/list",
  CREATE_INSTRUCTOR: "api/users/createusers",
  UPDATE_INSTRUCTOR: "api/users/viewuser",
  DELETE_INSTRUCTOR: "api/users/deleteuser",
  GET_COUNTRY: "api/users/getcountries",
  GET_STATE: "api/users/getstates",
} as const

export type APIKeys = keyof typeof APICONSTANT;