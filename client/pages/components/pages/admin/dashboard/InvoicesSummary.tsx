"use client"

import React, { useEffect, useState } from "react";
import { Invoice, useListInvoices } from "@/api-hooks/invoices/useListInvoices";
import { cn } from "@/utils/cn";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";

function InvoicesSummary({ customerId }: { customerId?: string }) {

  //----TABLE STATES------
  const [totalAmount, setTotalAmount] = useState(0);
  //------Storage---------\

  const columnHelper = createColumnHelper<Invoice>();
  const tanstackColumns = [
    columnHelper.accessor("number", {
      header: "Invoice No.",
      cell: ({ getValue }) => <div>TB{getValue()}</div>,
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
          return (
            <div>{Number(outstanding).toLocaleString("en-US")}$</div>
          );
        },
      }),
  ];
  const { pagination, setPagination } = useReactTablePagination();

  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useListInvoices({ customerId });

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
            <div className="box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Invoices Summary</h2>
            </div>

            <div className="py-2 px-4 overflow-hidden">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={invoicesData?.invoices || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={invoicesData?.totalCount || 0}
                totalAmount={totalAmount.toFixed(2) + "$"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicesSummary;
