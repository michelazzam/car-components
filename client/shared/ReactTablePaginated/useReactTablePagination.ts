import { useQueryStrings } from "@/hooks/useQueryStrings";
import { type OnChangeFn, type PaginationState } from "@tanstack/react-table";
import { useMemo } from "react";

type UseReactTablePaginationResult = {
  pagination: PaginationState;
  pageIndex: number;
  pageSize: number;
  setPagination: (updater: OnChangeFn<PaginationState>) => void;
};

export default function useReactTablePagination(): UseReactTablePaginationResult {
  const { appendQueries, currentQueries } = useQueryStrings();

  const pageIndex = Number(currentQueries.pageIndex) || 0;
  const pageSize = Number(currentQueries.pageSize) || 10;

  const setPagination = (updater: OnChangeFn<PaginationState>) => {
    // excuse me God, I was obliged to use any type here, but its of type PaginationState
    const newState: any = updater({ pageIndex, pageSize });

    appendQueries({
      pageIndex: newState.pageIndex,
      pageSize: newState.pageSize,
    });
  };

  return {
    pagination: useMemo(
      () => ({
        pageIndex,
        pageSize,
      }),
      [pageIndex, pageSize]
    ),
    pageIndex,
    pageSize,
    setPagination,
  };
}
