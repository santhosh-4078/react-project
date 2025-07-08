import { ColumnDef } from "@tanstack/react-table";

export type CustomColumnMeta = {
  showFilter?: string;
};

export type ColumnWithMeta<T> = ColumnDef<T, unknown> & {
  meta?: CustomColumnMeta;
};