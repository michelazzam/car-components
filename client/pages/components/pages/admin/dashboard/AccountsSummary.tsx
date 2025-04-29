"use client";

import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
//   useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import {
  CustomerAccount,
  useGetAccountReports,
} from "@/api-hooks/report/get-account-summary";

function AccountsSummary() {
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
  } = useGetAccountReports();

  if (!accountData) return;
  const tableData: CustomerAccount[] = [
    ...accountData?.rows,
    {
      customerName: "Total",
      invoiceAmount: accountData.totals.totalInvoiceAmount,
      amountPaid: accountData.totals.totalAmountPaid,
      outstandingAmount: accountData.totals.totalOutstandingAmount,
    },
  ];
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
            </div>
            <div className="py-2 px-4 overflow-hidden">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsSummary;
