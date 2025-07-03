// ✅ hooks/usePostMutation.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { postApiMethod } from "../services/global";

interface PostMutationParams {
  url: { apiUrl: string };
  body: Record<string, unknown> | FormData;
}

export default function usePostMutation(onSuccessRedirect?: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ url, body }: PostMutationParams) => {
      return await postApiMethod(url.apiUrl, body);
    },
    onSuccess: (data) => {
      console.log("✅ Post success:", data);
      if (onSuccessRedirect) {
        navigate(onSuccessRedirect);
      }
    },
    onError: (error) => {
      console.error("❌ Post error:", error);
    },
  });
}

// import { useMutation, UseMutationResult } from "@tanstack/react-query";
// // import { showToast } from "@/components/toastNotifiation/toastNotification";
// import { useNavigate } from "react-router";
// import { postApiMethod } from "../services/global";

// // Define expected input and response types
// interface PostPayload {
//   url: Record<string, any>;
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

// const usePostMutation = (navi?: string): UseMutationResult<ApiResponse, unknown, PostPayload> => {
//   const navigate = useNavigate();

//   return useMutation<ApiResponse, unknown, PostPayload>({
//     mutationFn: postApiMethod,
//     onSuccess: (data) => {
//       if (data.status === true) {
//         // showToast(data.message);
//         if (navi) {
//           navigate(navi);
//         }
//       } else if (data.status === 422) {
//         // showToast(data?.data?.message || "Validation Error", "error");
//       }
//     },
//     onError: (err) => {
//       console.error("Mutation Error:", err);
//     //   showToast("Something went wrong", "error");
//     },
//   });
// };

// export default usePostMutation;