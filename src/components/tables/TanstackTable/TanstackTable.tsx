import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import useReactQuery from "../../../hooks/useReactQuery";
import { APIKeys } from "../../../services/config";

interface TanstackTableProps<T> {
  listAPI: APIKeys;
  columns: ColumnDef<T, unknown>[];
  queryString?: string;
}

const SkeletonLoader = ({ columns, rows = 6 }: { columns: number; rows?: number }) => (
  <table className="min-w-full">
    <thead>
      <tr>
        {Array.from({ length: columns }).map((_, i) => (
          <th
            key={i}
            className="border-b border-gray-100 p-2 text-gray-800 dark:text-white/90 text-theme-xs"
          >
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td
              key={colIndex}
              className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90"
            >
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const TanstackTable = <T,>({
  listAPI,
  columns,
  queryString = "",
}: TanstackTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const query_string = useMemo(() => {
    const params = new URLSearchParams(queryString);
    params.set("page", page.toString());
    params.set("limit", pageSize.toString());
    return params.toString();
  }, [page, pageSize, queryString]);

  const { data, isLoading } = useReactQuery<T>(listAPI, query_string);
  // ✅ FIXED: Read correct pagination structure
  //const totalCount = data?.pagination?.totalUsers || 0;
  const totalPages = data?.pagination?.totalPages || 1;
  const tableData = data?.data || data?.datas
  console.log("data", data);

  const table = useReactTable({
    data: tableData || [],
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      const nextPage =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize }).pageIndex + 1
          : page;
      setPage(nextPage);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <SkeletonLoader columns={columns.length} rows={6} />;
  }

  const hasData = tableData && tableData.length > 0;

  return (
    <div>
      {hasData ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b text-start border-gray-100 dark:border-white/[0.05] p-2 text-gray-800 dark:text-white/90 text-theme-xs"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
            <div className="flex gap-2">
              <p className="text-gray-800 text-theme-sm dark:text-white/90">
                Page {page} of {totalPages}
              </p>
              <select
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white/90 text-sm rounded"
                value={pageSize}
                onChange={(e) => {
                  setPage(1);
                  setPageSize(Number(e.target.value));
                }}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white/90 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white/90 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
          No data found
        </p>
      )}
    </div>
  );
};

export default TanstackTable;