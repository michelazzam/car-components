"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import {
  Product,
  useListProducts,
} from "@/api-hooks/products/use-list-products";
import Link from "next/link";
import { PiExportLight } from "react-icons/pi";
import ExportInventoryModal from "./ExportInventoryModal";
import Pagination from "@/components/admin/Pagination";

function InventorySummary() {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  //------Storage---------\

  const columnHelper = createColumnHelper<Product>();
  const tanstackColumns = [
    columnHelper.accessor("name", {
      header: "inventory",
      cell: ({ getValue }) => <div>{getValue()}</div>,
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
  } = useListProducts({
    pageIndex: pageIndex - 1,
    pageSize: pageSize,
  });

  // Calculate the total amount for all invoices

  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Inventory Summary</h2>
              <Link
                href={"/admin/inventory"}
                className={`absolute top-4 right-4 w-5 h-5 rounded-full ${
                  isLoading ? "bg-danger" : "bg-green"
                }`}
              />
            </div>
            <div className="py-2 px-4 overflow-hidden">
              <div className="flex justify-end">
                <button
                  className="ti ti-btn ti-btn-secondary h-fit"
                  data-hs-overlay="#export-inventoryModal"
                >
                  <PiExportLight size={20} />
                </button>
              </div>

              <div>
                <ReactTablePaginated
                  errorMessage={error?.message}
                  data={inventoryData?.items || []}
                  columns={tanstackColumns}
                  loading={isLoading}
                  paginating={isFetching}
                  hidePagination
                  pagination={pagination}
                  setPagination={setPagination}
                  totalRows={inventoryData?.pagination?.totalCount || 0}
                />
                <Pagination
                  totalPages={inventoryData?.pagination?.totalPages || 0}
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
      <ExportInventoryModal
        totalCount={inventoryData?.pagination?.totalCount || 0}
        columns={tanstackColumns}
      />
    </div>
  );
}

export default InventorySummary;
