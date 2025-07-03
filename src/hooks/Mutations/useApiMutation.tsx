import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { apiMethod } from "../../services/global";

type HttpMethod = "post" | "put" | "patch" | "delete";

interface ApiMutationParams {
  url: { apiUrl: string };
  body?: Record<string, unknown> | FormData;
}

export default function useApiMutation(
  method: HttpMethod,
  onSuccessRedirect?: string
) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ url, body }: ApiMutationParams) => {
      return await apiMethod(method, url.apiUrl, body);
    },
    onSuccess: (data) => {
      console.log(`${method.toUpperCase()} success:`, data);
      if (onSuccessRedirect) {
        navigate(onSuccessRedirect);
      }
    },
    onError: (error) => {
      console.error(`${method.toUpperCase()} error:`, error);
    },
  });
}