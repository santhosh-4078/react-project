import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { loginApiMethod, setToken } from "../../services/authService";

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

export default function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginApiProps) => loginApiMethod(payload),
    onSuccess: (data) => {
      if (data?.success === true) {
        setToken(data?.datas?.[0]?.token);
        navigate("/");
      } else {
        console.error("Login failed: Invalid response format", data);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
}