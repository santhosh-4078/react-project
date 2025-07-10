import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { loginApiMethod, setToken } from "../../services/authService";
import { showToast } from "../../Utils/Toast";

interface LoginPayload {
  email_id: string;
  password: string;
  // role: string;
  // rememberMe: boolean;
}

interface LoginApiProps {
  url: { apiUrl: string };
  body: LoginPayload;
}

interface LoginResponse {
  success: boolean;
  message: string;
  datas: {
    token: string;
    id: string | number;
  }[];
}

interface ErrorResponse {
  message?: string;
}

export default function useLoginMutation(): UseMutationResult<LoginResponse, AxiosError, LoginApiProps> {
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError, LoginApiProps>({
    mutationFn: loginApiMethod,

    onSuccess: (data) => {
      if (data?.success) {
        const token = data?.datas?.[0]?.token;
        const userId = data?.datas?.[0]?.id?.toString();

        if (token && userId) {
          setToken(token, userId);
        }

        showToast(data?.message || "Login successful", "success");
        // navigate("/");
        navigate("/instructors")
      } else {
        console.error("Login failed: Invalid response format", data);
        showToast(data?.message || "Login failed", "error");
      }
    },
    onError: (error) => {
      const errorData = error.response?.data as ErrorResponse;
      showToast(errorData?.message || "Login error", "error");
      console.error("Login error:", errorData?.message);
    },
  });
}