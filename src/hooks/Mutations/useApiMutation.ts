import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { apiMethod } from "../../services/global";
import { showToast } from "../../Utils/Toast";

type HttpMethod = "post" | "put" | "patch" | "delete";

interface ApiMutationParams {
  url: { apiUrl: string };
  body?: Record<string, unknown> | FormData;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export default function useApiMutation(
  method: HttpMethod,
  onSuccessRedirect?: string,
  customSuccessMessage?: string
): UseMutationResult<ApiResponse, AxiosError, ApiMutationParams> {
  const navigate = useNavigate();

  return useMutation<ApiResponse, AxiosError, ApiMutationParams>({
    mutationFn: async ({ url, body }) => {
      return await apiMethod(method, url.apiUrl, body);
    },
    onSuccess: (response) => {
      const message = customSuccessMessage || response.message || "Action successful!";
      showToast(message, "success");

      console.log(`${method.toUpperCase()} success:`, response);

      if (onSuccessRedirect) {
        navigate(onSuccessRedirect);
      }
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message || "Something went wrong!";
      showToast(errorMessage, "error");
      console.error(`${method.toUpperCase()} error:`, error);
    },
  });
}
