import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { apiMethod } from "../../services/global";
import { showToast } from "../../Utils/Toast";

export interface MutationParams {
  url: { apiUrl: string };
  body?: Record<string, unknown> | FormData;
}

export interface ApiResponse {
  status: boolean | number | string;
  success: boolean | number | string;
  message: string;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
}

export default function useDeleteMutation(
  onSuccessRedirect?: string
): UseMutationResult<ApiResponse, unknown, MutationParams> {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ url, body }) => {
      return await apiMethod("delete", url.apiUrl, body);
    },
    onSuccess: (data) => {
      console.log("DELETE success:", data);
      showToast(data.message || "Submitted successfully", "success");
      if (onSuccessRedirect) navigate(onSuccessRedirect);
    },
    onError: (error) => {
      console.error("DELETE error:", error);
    },
  });
}