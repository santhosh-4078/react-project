/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from "axios";
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
  apiUrl: string,
  body: Record<string, unknown> | FormData
) => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
  };

  const response = await axios.post(`${APIURLS.baseUrl}${apiUrl}`, body, { headers });
  return response.data;
};

export const apiMethod = async (
  method: "post" | "put" | "patch" | "delete",
  apiUrl: string,
  body?: Record<string, unknown> | FormData
) => {
  const token = localStorage.getItem("token");
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  try {
    const response = await axios({
      method,
      url: `${APIURLS.baseUrl}${apiUrl}`,
      data: body,
      headers,
    });

    return response.data;
  } catch (error: unknown) {
    // Optional: log or transform error
    console.error("❌ API error:");
    throw error;
  }
};

// interface PostApiPayload {
//   url: {
//     apiUrl: string;
//   };
//   body: Record<string, any>;
// }

// interface ApiResponse {
//   status: boolean | number;
//   message: string;
//   data?: {
//     message?: string;
//     [key: string]: any;
//   };
// }

// export const postApiMethod = async ( data: PostApiPayload): Promise<ApiResponse> => {
//   try {
//     const api = APIURLS.baseUrl + data.url.apiUrl;
//     const token = localStorage.getItem("token");

//     const config = {
//       headers: {
//         Authorization: token || "",
//         // You can uncomment below if needed
//         // "x-client-id": deviceId || "",
//       },
//     };

//     const response: AxiosResponse<ApiResponse> = await axios.post(api, data.body, config);

//     if (
//       response.data?.status === true ||
//       response.status === 200 ||
//       response.status === 201
//     ) {
//       return response.data;
//     } else {
//       return response.data;
//     }
//   } catch (error: any) {
//     // Consider returning a standard error shape if needed
//     throw new Error(error?.message || "Unknown error");
//   }
// };