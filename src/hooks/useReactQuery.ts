/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { getApiMethos } from "../services/global";
import { APICONSTANT, APIKeys } from "../services/config";

const useReactQuery = <T>(key: APIKeys, query_string: string) => {
  return useQuery({
    queryKey: [key, APICONSTANT[key], query_string],
    queryFn: getApiMethos,
    retry: 0,
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