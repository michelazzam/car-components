import React, { useState } from "react";
import {
  FlattenedInvoice,
  useListInvoices,
} from "@/api-hooks/invoices/useListInvoices";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import DateRangeField, {
  DateRange,
} from "@/components/admin/Fields/DateRangeField";
import { PiExportLight } from "react-icons/pi";
import Pagination from "@/components/admin/Pagination";
import ExportSalesProductsModal from "./ExportSalesProductsModal";
function SalesProductsSummary({ customerId }: { customerId?: string }) {
  const [dates, setDates] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  //------Storage---------\

  const columnHelper = createColumnHelper<FlattenedInvoice>();
  const tanstackColumns = [
    columnHelper.accessor("item.name", {
      header: "Product",
    }),
    columnHelper.accessor("number", {
      header: "Invoice No.",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("item.quantity", {
      header: "Stock Quantity",
    }),
    columnHelper.accessor("item.cost", {
      header: "Unit Cost",
      cell: ({ getValue }) => <div>{getValue()?.toLocaleString("en-US")}$</div>,
    }),
    columnHelper.accessor("item", {
      header: "Total Value",
      cell: ({ getValue }) => (
        <div>
          <div>
            {(getValue()?.cost * getValue()?.quantity)?.toLocaleString("en-US")}
            $
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("item.price", {
      header: "Sales Price",
    }),

    columnHelper.accessor("item", {
      header: "Total Sales Value",
      cell: ({ getValue }) => (
        <div>
          <div>
            {(getValue()?.price * getValue()?.quantity)?.toLocaleString(
              "en-US"
            )}
            $
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("item", {
      header: "Profit/Loss",
      cell: ({ getValue }) => (
        <div>
          <div>
            {(
              (getValue()?.price - getValue()?.cost) *
              getValue()?.quantity
            )?.toLocaleString("en-US")}
            $
          </div>
        </div>
      ),
    }),
  ];
  const { pagination, setPagination } = useReactTablePagination();

  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useListInvoices({
    customerId,
    startDateState: dates.startDate ?? undefined,
    endDateState: dates.endDate ?? undefined,
    localPageIndex: pageIndex - 1,
    localPageSize: pageSize,
  });

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className=" relative box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Sales Products Summary</h2>
            </div>
            <div className="py-2 px-4">
              <div className="flex justify-between items-center">
                <div className="w-[20rem]">
                  <DateRangeField
                    dates={dates}
                    setDates={setDates}
                    label="Date Range"
                    colSpan={6}
                    marginBottom="mb-5"
                  />
                </div>
                <button
                  className="ti ti-btn ti-btn-secondary h-fit"
                  data-hs-overlay="#export-salesProductsModal"
                >
                  <PiExportLight size={20} />
                </button>
              </div>
              <div>
                <ReactTablePaginated
                  errorMessage={error?.message}
                  data={invoicesData?.flattenedInvoices || []}
                  columns={tanstackColumns}
                  loading={isLoading}
                  paginating={isFetching}
                  hidePagination
                  pagination={pagination}
                  setPagination={setPagination}
                  totalRows={invoicesData?.pagination.totalCount || 0}
                  // totalAmount={totalAmount.toFixed(2) + "$"}
                />

                <Pagination
                  totalPages={invoicesData?.pagination.totalPages || 0}
                  currentPage={pageIndex}
                  setCurrentPage={setPageIndex}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExportSalesProductsModal
        totalCount={invoicesData?.pagination.totalCount || 0}
        columns={tanstackColumns}
        startDate={dates.startDate}
        endDate={dates.endDate}
      />
    </div>
  );
}

export default SalesProductsSummary;
