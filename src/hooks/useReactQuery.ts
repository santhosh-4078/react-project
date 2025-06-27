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