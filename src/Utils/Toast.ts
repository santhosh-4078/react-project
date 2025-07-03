// src/utils/toast.ts
import { toast } from "react-toastify";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "success"
) => {
  toast[type](message);
};