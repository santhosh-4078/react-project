import React, { useState } from "react";
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

const TanstackTable = <T,>({ listAPI, columns, queryString = "", }: TanstackTableProps<T>) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const query_string = `_page=${page}&_limit=${pageSize}` + (queryString ? `&${queryString}` : "");
  const { data, isLoading } = useReactQuery<T>(listAPI, query_string);

  const table = useReactTable({
    data: data?.items || [],
    columns,
    pageCount: data?.totalPages || -1,
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <table className="min-w-full border">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="border p-2">
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
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === data?.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TanstackTable;