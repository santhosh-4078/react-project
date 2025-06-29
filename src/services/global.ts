/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "./axiosInstance";
import { APIURLS } from "./config";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getApiMethos = async (
  context: QueryFunctionContext<[string, string, string?]>
) => {
  const [_, apiConstant, query_string] = context.queryKey;
  const signal = context.signal;

  const api = query_string
    ? `${APIURLS.baseUrl}${apiConstant}?${query_string}`
    : `${APIURLS.baseUrl}${apiConstant}`;

  const token = localStorage.getItem("token");

  const config = {
    signal,
    headers: {
      Authorization: token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZDczM2Q2YjE1NTViOTc5MWM5OTMiLCJlbWFpbCI6ImFkbWluQGZvb2RzdGFyLmNvbSIsIm5hbWUiOiJGb29kc3RhciIsInR5cGUiOiJBRE1JTiIsImlhdCI6MTc1MTIwMjUyNiwiZXhwIjoxNzUzNzk0NTI2fQ.hgBVr3H_wennUiRhmj4eQ4aHn5Ak_gkr6gvRDk2ieKU",
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
