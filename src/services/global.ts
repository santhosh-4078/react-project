/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "./axiosInstance";
import { APIURLS } from "./config";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getApiMethos = async (
  context: QueryFunctionContext<[string, string, string?]>
) => {
  const [, apiConstant, query_string = ""] = context.queryKey;
  const signal = context.signal;

  // Safely merge `user_group=instructor` with existing query string
  const hasQuery = query_string.length > 0;
  const query = hasQuery
    ? `user_group=instructor&${query_string}`
    : `user_group=instructor`;

  const api = `${APIURLS.baseUrl}${apiConstant}?${query}`;

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const config = {
    signal,
    headers: {
      // application/x-www-form-urlencoded is unnecessary unless POST-ing body
      Authorization: token,
    },
  };

  const response = await axios.get(api, config);
  return response.data;
};

export const postApiMethod = async (
  context: QueryFunctionContext<[string, string, unknown]>
) => {
  const [_, apiConstant, body] = context.queryKey;
  const signal = context.signal;

  const api = `${APIURLS.baseUrl}${apiConstant}`;
  const token = localStorage.getItem("token");

  const config = {
    signal,
    headers: {
      Authorization: token || "",
    },
  };

  const response = await axios.post(api, body, config);
  return response.data;
};

export const putApiMethod = async (
  context: QueryFunctionContext<[string, string, unknown]>
) => {
  const [_, apiConstant, body] = context.queryKey;
  const signal = context.signal;

  const api = `${APIURLS.baseUrl}${apiConstant}`;
  const token = localStorage.getItem("token");

  const config = {
    signal,
    headers: {
      Authorization: token || "",
    },
  };

  const response = await axios.put(api, body, config);
  return response.data;
};

export const deleteApiMethod = async (
  context: QueryFunctionContext<[string, string, string | number]>
) => {
  const [_, apiConstant, id] = context.queryKey;
  const signal = context.signal;

  const api = `${APIURLS.baseUrl}${apiConstant}/${id}`;
  const token = localStorage.getItem("token");

  const config = {
    signal,
    headers: {
      Authorization: token || "",
    },
  };

  const response = await axios.delete(api, config);
  return response.data;
};
