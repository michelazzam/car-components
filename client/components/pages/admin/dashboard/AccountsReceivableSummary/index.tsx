"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  //   useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import {
  CustomerAccount,
  useGetAccountReports,
} from "@/api-hooks/report/get-account-summary";
import Link from "next/link";
import DateRangeField, {
  DateRange,
} from "@/components/admin/Fields/DateRangeField";
import { PiExportLight } from "react-icons/pi";
import AccountsReceivableSummaryModal from "./AccountsReceivableSummaryModal";
import Pagination from "@/components/admin/Pagination";

function AccountsSummary() {
  const [dates, setDates] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);

  //------Storage---------\

  const columnHelper = createColumnHelper<CustomerAccount>();
  const tanstackColumns = [
    columnHelper.accessor("customerName", {
      header: "Customer",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("invoiceAmount", {
      header: "Invoice Amount",
      cell: ({ getValue }) => (
        <div>
          <div>{getValue()}</div>
        </div>
      ),
    }),

    columnHelper.accessor("amountPaid", {
      header: "Amount Paid",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
    columnHelper.accessor("outstandingAmount", {
      header: "Outstanding Amount",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
  ];
  //   const { pagination, setPagination } = useReactTablePagination();

  const {
    data: accountData,
    isLoading,
    error,
    // isFetching,
  } = useGetAccountReports({
    pageSize: pageSize,
    pageIndex: pageIndex - 1,
    startDate: dates.startDate ?? undefined,
    endDate: dates.endDate ?? undefined,
  });

  const tableData: CustomerAccount[] = accountData
    ? [
        ...accountData?.rows,
        {
          customerName: "Total",
          invoiceAmount: accountData?.totals?.totalInvoiceAmount,
          amountPaid: accountData?.totals?.totalAmountPaid,
          outstandingAmount: accountData?.totals?.totalOutstandingAmount,
        },
      ]
    : [];
  // Calculate the total amount for all invoices

  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">
                Accounts Receivable Summary
              </h2>
              <Link
                href={"/admin/customers"}
                className={`absolute top-4 right-4 w-5 h-5 rounded-full ${
                  isLoading ? "bg-danger" : "bg-green"
                }`}
              />
            </div>
            <div className="py-2 px-4 overflow-hidden">
              <div className="flex justify-between  items-center">
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
                  data-hs-overlay="#export-accountsSummaryModal"
                >
                  <PiExportLight size={20} />
                </button>
              </div>

              <div>
                <ReactTablePaginated
                  errorMessage={error?.message}
                  data={tableData || []}
                  columns={tanstackColumns}
                  loading={isLoading}
                  // paginating={isFetching}
                  // pagination={pagination}
                  // setPagination={setPagination}

                  totalRows={5}
                  hidePagination
                />
                <Pagination
                  setCurrentPage={setPageIndex}
                  currentPage={pageIndex}
                  totalPages={accountData?.pagination?.totalPages || 0}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AccountsReceivableSummaryModal
        totalCount={accountData?.pagination?.totalCount || 0}
        columns={tanstackColumns}
        startDate={dates.startDate}
        endDate={dates.endDate}
      />
    </div>
  );
}

export default AccountsSummary;
