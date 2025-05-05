import React from "react";
import {
  FlattenedInvoice,
  useListInvoices,
} from "@/api-hooks/invoices/useListInvoices";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";

function SalesProductsSummary({ customerId }: { customerId?: string }) {
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
      cell: ({ getValue }) => <div>{getValue().toLocaleString("en-US")}$</div>,
    }),
    columnHelper.accessor("item", {
      header: "Total Value",
      cell: ({ getValue }) => (
        <div>
          <div>
            {(getValue().cost * getValue().quantity).toLocaleString("en-US")}$
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
            {(getValue().price * getValue().quantity).toLocaleString("en-US")}$
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
              (getValue().price - getValue().cost) *
              getValue().quantity
            ).toLocaleString("en-US")}
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
  } = useListInvoices({ customerId });

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className=" relative box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Sales Products Summary</h2>
            </div>
            <div className="py-2 px-4">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={invoicesData?.flattenedInvoices || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={invoicesData?.totalCount || 0}
                // totalAmount={totalAmount.toFixed(2) + "$"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesProductsSummary;
