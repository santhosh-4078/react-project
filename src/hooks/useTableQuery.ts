import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTableQuery = <T,>(
  listAPI: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: [listAPI, page, pageSize],
    queryFn: async () => {
      const response = await axios.get(listAPI, {
        params: {
          _page: page,
          _limit: pageSize,
        },
      });

      const total = Number(response.headers["x-total-count"] || 0);
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: response.data as T[],
        total,
        totalPages,
      };
    },
    placeholderData: (prev) => prev,
  });
};