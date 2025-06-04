import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import useMyReactTable from "./useMyReactTable";
import TableStyle from "./TableStyle";

export default function ReactTablePaginated<DataType>({
  columns,
  data,
  totalRows,
  loading,
  paginating,
  pagination,
  setPagination,
  hidePagination,
  errorMessage,
  estimatedPageSize = 10,
  renderInTheBottom,
  overflowX,
}: {
  columns: ColumnDef<DataType, any>[];
  data: DataType[];
  totalRows: number;
  loading: boolean;
  paginating?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination?: (updater: OnChangeFn<PaginationState>) => void;
  hidePagination?: boolean;
  errorMessage?: string | undefined;
  estimatedPageSize?: number;
  renderInTheBottom?: React.ReactNode;
  overflowX?: string;
}) {
  const table = useMyReactTable<DataType>({
    columns,
    data,
    pagination,
    setPagination,
    totalRows,
  });

  return (
    <>
      <TableStyle overflowX={overflowX}>
        <div className="relative">
          <table className="min-w-full">
            <TableHead table={table} />
            {loading ? (
              <>
                {Array.from({ length: estimatedPageSize }).map(() => (
                  <SkeletonLoader columnsLength={columns.length} />
                ))}
              </>
            ) : (
              <TableBody table={table} />
            )}
          </table>
        </div>
        {!loading && !paginating && data?.length === 0 && (
          <div className="flex items-center py-5 justify-center">
            <div className="text-center">
              <div className="text-gray-500 text-sm">No results found</div>
            </div>
          </div>
        )}
        <Pagination
          table={table}
          totalRows={totalRows}
          paginating={paginating}
          hidePagination={hidePagination}
          renderInTheBottom={renderInTheBottom}
        />
      </TableStyle>

      {errorMessage && <ErrorAlert errorMessage={errorMessage} />}
    </>
  );
}

function ErrorAlert({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="w-fit">
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-red-800 text-sm font-medium">
            <span className="text-red-500">{errorMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader({ columnsLength }: { columnsLength: number }) {
  return (
    <tbody className="bg-white">
      <tr className="border-b even:bg-gray-50">
        {Array.from({ length: columnsLength }).map((_, index) => (
          <td
            key={index}
            className="whitespace-nowrap p-2 text-start text-sm font-medium text-gray-900"
          >
            <div className="animate-pulse min-w-full">
              <div className="flex-1 p-2">
                <div className="space-y-3 w-1/2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </td>
        ))}
      </tr>
    </tbody>
  );
}
