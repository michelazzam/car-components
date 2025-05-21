import {
  CaisseHistoryRecord,
  useListCaisseRecords,
} from "@/api-hooks/caisse/use-list-caisse-records";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import React, { useState } from "react";
import Pagination from "@/components/admin/Pagination";
import { createColumnHelper } from "@tanstack/react-table";
import { formatNumber } from "@/lib/helpers/formatNumber";
import DateRangeField, {
  DateRange,
} from "@/components/admin/Fields/DateRangeField";

function CaisseHistoryTable() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dates, setDates] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const { data: causseHistory, isLoading } = useListCaisseRecords({
    pageIndex: pageIndex - 1,
    pageSize: pageSize,
    startDate: dates.startDate ?? undefined,
    endDate: dates.endDate ?? undefined,
  });
  const columnHelper = createColumnHelper<CaisseHistoryRecord>();
  const tanstackColumns = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("openedAt", {
      header: "Opened At",
      cell: ({ row }) => (
        <div>
          {row.original.openedAt
            ? new Date(row.original.openedAt).toLocaleString()
            : "N/A"}
        </div>
      ),
    }),
    columnHelper.accessor("openedAmount", {
      header: "Opened Amount",
      cell: ({ getValue }) => <div> {formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("closedAt", {
      header: "Closed At",
      cell: ({ row }) => (
        <div>
          {row.original.closedAt
            ? new Date(row.original.closedAt).toLocaleString()
            : "N/A"}
        </div>
      ),
    }),
    columnHelper.accessor("expectedAmountToClose", {
      header: "Expected Amount To Close",
      cell: ({ getValue }) => <div> {formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("closedAmount", {
      header: "Closed Amount",
      cell: ({ getValue }) => <div> {formatNumber(getValue(), 2)}$</div>,
    }),
  ];

  return (
    <div className="mt-4 box">
      <div className="box-header">
        <h5 className="box-title">Caisse History</h5>
        <div className="box-tools">
          <DateRangeField
            label="Date Range"
            dates={dates}
            setDates={setDates}
          />
        </div>
      </div>
      <div className="box-body">
        <ReactTablePaginated
          data={causseHistory?.caisseHistory || []}
          columns={tanstackColumns}
          hidePagination
          loading={isLoading}
          totalRows={pageSize * (causseHistory?.pagination.totalPages || 0)}
        />
        <Pagination
          currentPage={pageIndex}
          setCurrentPage={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={causseHistory?.pagination.totalPages || 0}
        />
      </div>
    </div>
  );
}

export default CaisseHistoryTable;
