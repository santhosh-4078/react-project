import { useQuery } from "@tanstack/react-query";
import { getApiMethos } from "../services/global";
import { APICONSTANT, APIKeys } from "../services/config";

// const useReactQuery = (key: APIKeys, query_string: string, enabled = true) => {
//   return useQuery({
//     queryKey: [key, APICONSTANT[key], query_string],
//     queryFn: getApiMethos,
//     enabled,
//     retry: 0,
//     refetchOnMount: true,
//   });
// };

const useReactQuery = (
  key: APIKeys,
  query_string: string,
  enabled = true,
  includeInstructorGroup = false
) => {
  return useQuery({
    queryKey: [key, APICONSTANT[key], query_string, includeInstructorGroup],
    queryFn: getApiMethos,
    enabled,
    retry: 0,
    refetchOnMount: true,
  });
};

export default useReactQuery;

// import { useQuery, UseQueryOptions } from "@tanstack/react-query";
// import { getApiMethos } from "../services/global";
// import { APICONSTANT, APIKeys } from "../services/config";

// const useReactQuery = <T>(
//   key: APIKeys,
//   query_string: string,
//   options?: UseQueryOptions<T>
// ) => {
//   return useQuery<T>({
//     queryKey: [key, APICONSTANT[key], query_string],
//     queryFn: getApiMethos,
//     retry: 0,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000, // 5 mins
//     ...options, // allow override
//   });
// };

// export default useReactQuery;
