// src/services/global.ts
import axios from "./axiosInstance";
import { APIURLS } from "./config";
import { QueryFunctionContext } from "@tanstack/react-query";

// GET API Method (for useQuery)
export const getApiMethos = async (
  context: QueryFunctionContext<[string, string, string?, boolean?]>
) => {
  const [, apiConstant, query_string = "", includeInstructorGroup = false] = context.queryKey;
  const signal = context.signal;

  let query = query_string;
  if (includeInstructorGroup) {
    query = query
      ? `user_group=instructor&${query_string}`
      : "user_group=instructor";
  }

  const api = `${APIURLS.baseUrl}${apiConstant}?${query}`;
  // console.log("includeInstructorGroup:", includeInstructorGroup);
  // console.log("Final API URL:", api);

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const config = {
    signal,
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.get(api, config);
  return response.data;
};

// POST API Method (non-generic)
export const postApiMethod = async (
  apiUrl: string,
  body: Record<string, unknown> | FormData | URLSearchParams
) => {
  try {
    const url = `${APIURLS.baseUrl}${apiUrl}`;
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error("POST error:", error);
    throw error;
  }
};

// PUT API Method (non-generic)
export const putApiMethod = async (
  apiUrl: string,
  body: Record<string, unknown> | FormData
) => {
  try {
    const url = `${APIURLS.baseUrl}${apiUrl}`;
    const response = await axios.put(url, body);
    return response.data;
  } catch (error) {
    console.error("PUT error:", error);
    throw error;
  }
};

// PATCH API Method (non-generic)
export const patchApiMethod = async (
  apiUrl: string,
  body: Record<string, unknown> | FormData
) => {
  try {
    const url = `${APIURLS.baseUrl}${apiUrl}`;
    const response = await axios.patch(url, body);
    return response.data;
  } catch (error) {
    console.error("PATCH error:", error);
    throw error;
  }
};

// DELETE API Method (non-generic)
export const deleteApiMethod = async (
  apiUrl: string,
  body?: Record<string, unknown>
) => {
  try {
    const url = `${APIURLS.baseUrl}${apiUrl}`;
    const config = body ? { data: body } : undefined;
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    console.error("DELETE error:", error);
    throw error;
  }
};

// Generic Method for POST, PUT, PATCH, DELETE
export const apiMethod = async (
  method: "post" | "put" | "patch" | "delete" | "get",
  apiUrl: string,
  body?: Record<string, unknown> | FormData
) => {
  try {
    const response = await axios({
      method,
      url: `${APIURLS.baseUrl}${apiUrl}`,
      data: body,
    });

    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} error at ${apiUrl}:`, error);
    throw error;
  }
};