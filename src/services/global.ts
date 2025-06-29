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
      Authorization: token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZDczM2Q2YjE1NTViOTc5MWM5OTMiLCJlbWFpbCI6ImFkbWluQGZvb2RzdGFyLmNvbSIsIm5hbWUiOiJhYnNzIiwidHlwZSI6IkFETUlOIiwiaWF0IjoxNzUxMDMzMTc2LCJleHAiOjE3NTM2MjUxNzZ9.kZpvRLO4plfUDsXnzzsiPdoUdc6SJM3G2Q1xSyE6NGE",
    },
  };

  const response = await axios.get(api, config);
  return response.data;
};

export const putApiMethod = async (data: any) => {
  const api = APIURLS.baseUrl + data.url.apiUrl;
  const token = await localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.put(api, data.body, config);
  if (response.type === 'success') {
    throw response.message;
  }
  return response.data;
};

export const postApiMethod = async (data: any) => {
  try {
    const api = APIURLS.baseUrl + data.url.apiUrl;
    const token = await localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.post(api, data.body, config);
    if (response.type === "success" || response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      return response;
    }
  } catch (error: any) {
    throw new Error(error, { cause: error });
  }
};

export const deleteApiMethod = async (data: any) => {
  const api = APIURLS.baseUrl + data.url;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const Id = data ? data.id : null;
  const response = await axios.delete(`${api}/${Id}`, config);
  return response.data;
};
