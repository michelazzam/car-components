"use client";

import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import {
  Product,
  useListProducts,
} from "@/api-hooks/products/use-list-products";

function InventorySummary() {
  //------Storage---------\

  const columnHelper = createColumnHelper<Product>();
  const tanstackColumns = [
    columnHelper.accessor("name", {
      header: "inventory",
      cell: ({ getValue }) => <div>TB{getValue()}</div>,
    }),

    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: ({ getValue }) => (
        <div>
          <div>{getValue()}</div>
        </div>
      ),
    }),

    columnHelper.accessor("cost", {
      header: "Unit Cost",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
    columnHelper.accessor("totalCost", {
      header: "Total Value",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Sales Price",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Sales Price",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),

    columnHelper.accessor("profitOrLoss", {
      header: "Profit/Loss",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
  ];
  const { pagination, setPagination } = useReactTablePagination();
  const {
    data: inventoryData,
    isLoading,
    isFetching,
    error,
  } = useListProducts({});

  // Calculate the total amount for all invoices

  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Inventory Summary</h2>
            </div>
            <div className="py-2 px-4 overflow-hidden">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={inventoryData?.items || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={inventoryData?.totalCount || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventorySummary;
