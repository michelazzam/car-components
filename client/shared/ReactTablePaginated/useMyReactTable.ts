import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function useMyReactTable<DataType>({
  data,
  columns,
  totalRows,
  pagination,
  setPagination,
}: {
  data: DataType[];
  columns: ColumnDef<DataType, any>[];
  totalRows: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination?: (updater: OnChangeFn<PaginationState>) => void;
}) {
  return useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalRows / pagination?.pageSize!) ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination as any,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
}
