"use client";

import React, { useEffect, useState } from "react";
import { Invoice, useListInvoices } from "@/api-hooks/invoices/useListInvoices";
import { cn } from "@/utils/cn";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import Link from "next/link";
import DateRangeField, {
  DateRange,
} from "@/components/admin/Fields/DateRangeField";
import { PiExportLight } from "react-icons/pi";
import Pagination from "@/components/admin/Pagination";
import ExportInvoicesModal from "./ExportInvoicesModal";

function InvoicesSummary({ customerId }: { customerId?: string }) {
  const [dates, setDates] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const { pagination, setPagination } = useReactTablePagination();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useListInvoices({
    customerId,
    startDateState: dates.startDate ?? undefined,
    endDateState: dates.endDate ?? undefined,
    localPageSize: pageSize,
    localPageIndex: pageIndex - 1,
  });

  //----TABLE STATES------
  const [totalAmount, setTotalAmount] = useState(0);
  //------Storage---------\

  const columnHelper = createColumnHelper<Invoice>();
  const tanstackColumns = [
    columnHelper.accessor("number", {
      header: "Invoice No.",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    ...(!customerId
      ? [
          columnHelper.accessor("customer.name", {
            header: "Customer",
          }),
        ]
      : []),

    columnHelper.accessor("accounting.totalUsd", {
      header: "Amount",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),

    columnHelper.accessor("accounting.paidAmountUsd", {
      header: "Received Amount",
      cell: ({ getValue }) => (
        <div>
          <div>{Number(getValue()).toLocaleString("en-US")}$</div>
        </div>
      ),
    }),

    columnHelper.accessor("accounting.isPaid", {
      header: "Status",
      cell: ({ getValue }) => {
        return (
          <p
            data-hs-overlay={!getValue() && "#add-payment-modal"}
            className={cn(
              "rounded-md px-3 py-1 text-center",
              getValue() ? "text-success" : "border border-danger text-danger"
            )}
          >
            {getValue() ? "Paid" : "Unpaid"}
          </p>
        );
      },
    }),

    columnHelper.accessor("createdAt", {
      header: "Issued Date",
      cell: ({ getValue }) => (
        <div className="w-fit">
          {new Intl.DateTimeFormat("en-US", {
            year: "2-digit", // Use "2-digit" for two-digit year
            month: "short", // Use "short" for abbreviated month name
            day: "2-digit", // Use "2-digit" for two-digit day
          }).format(new Date(getValue()))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "outstanding",
      header: "Outstanding",
      cell: ({ row }) => {
        const total = row.original.accounting.totalUsd;
        const paid = row.original.accounting.paidAmountUsd;
        const outstanding = total - paid;

        // Only render after client is mounted
        return <div>{Number(outstanding).toLocaleString("en-US")}$</div>;
      },
    }),
  ];

  // Calculate the total amount for all invoices
  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = invoicesData?.invoices?.reduce(
        (acc, invoice) => acc + (invoice.accounting.totalUsd || 0),
        0
      );
      setTotalAmount(total || 0);
    };

    calculateTotalAmount();
  }, [invoicesData]);

  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className=" relative box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Invoices Summary</h2>
              <Link
                href={"/admin/invoices"}
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
                  data-hs-overlay="#export-invoicesModal"
                >
                  <PiExportLight size={20} />
                </button>
              </div>
              <div>
                <ReactTablePaginated
                  errorMessage={error?.message}
                  data={invoicesData?.invoices || []}
                  columns={tanstackColumns}
                  loading={isLoading}
                  paginating={isFetching}
                  pagination={pagination}
                  setPagination={setPagination}
                  hidePagination
                  totalRows={invoicesData?.pagination.totalCount || 0}
                  renderInTheBottom={
                    <span className="text-success font-bold">
                      Total Amount: {totalAmount.toFixed(2)} $
                    </span>
                  }
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
      <ExportInvoicesModal
        totalCount={invoicesData?.pagination.totalCount || 0}
        startDate={dates.startDate}
        endDate={dates.endDate}
        columns={tanstackColumns}
      />
    </div>
  );
}

export default InvoicesSummary;
