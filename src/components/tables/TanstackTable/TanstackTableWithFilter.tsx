import { ChangeEvent, useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    //   ColumnDef,
} from "@tanstack/react-table";
import { ColumnWithMeta } from "./ColumnMetaTable";
import useReactQuery from "../../../hooks/useReactQuery";
import { APIKeys } from "../../../services/config";
import Input from "../../form/input/InputField";

interface TanstackTableProps<T> {
    listAPI: APIKeys;
    columns: ColumnWithMeta<T>[];
    queryString?: string;
}

const TanstackTable = <T,>({
    listAPI,
    columns,
    queryString = "",
}: TanstackTableProps<T>) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const query_string = useMemo(() => {
        const params = new URLSearchParams(queryString);
        params.set("page", page.toString());
        params.set("limit", pageSize.toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        return params.toString();
    }, [page, pageSize, queryString, filters]);

    const { data, isLoading } = useReactQuery(listAPI, query_string);
    const totalPages = data?.pagination?.totalPages || 1;
    const tableData = data?.data || data?.datas;

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

    const showSkeletonRows = isLoading && (!tableData || tableData.length === 0);

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    {/* Table header */}
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

                    {/* Filter row */}
                    <tr>
                        {columns.map((column, index) => {
                            const filterKey = column.meta?.showFilter;
                            const value = filters[filterKey || ""] || "";

                            return (
                                <th key={`filter-${index}`} className="p-2 min-w-[150px]">
                                    {filterKey ? (
                                        <div className="relative">
                                            <Input
                                                placeholder="Search..."
                                                value={value}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        [filterKey]: e.target.value,
                                                    }))
                                                }
                                                className="w-full pr-6 text-sm"
                                            />
                                            {value && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            [filterKey]: "",
                                                        }))
                                                    }
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-sm"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ) : null}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {showSkeletonRows ? (
                        Array.from({ length: 6 }).map((_, rowIndex) => (
                            <tr key={`skeleton-${rowIndex}`}>
                                {columns.map((_, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90"
                                    >
                                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-2 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90"
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
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
    );
};

export default TanstackTable;