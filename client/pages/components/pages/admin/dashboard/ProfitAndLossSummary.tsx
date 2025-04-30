"use client";

import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { useGetGlobalReports } from "@/api-hooks/report/get-global-report";
// import {
//   Product,
//   useListProducts,
// } from "@/api-hooks/products/use-list-products";

interface ProfitAndLoss {
  description: string;
  amount: number;
}

function ProfitAndLossSummary() {
  //------Storage---------\

  const columnHelper = createColumnHelper<ProfitAndLoss>();
  const tanstackColumns = [
    columnHelper.accessor("description", {
      header: "Description",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("amount", {
      header: "Amount",
      cell: ({ getValue }) => (
        <div>{Number(getValue()).toLocaleString("en-US")}$</div>
      ),
    }),
  ];
  //   const { pagination, setPagination } = useReactTablePagination();
  const { data: reportsData, isLoading, error } = useGetGlobalReports();
  const data: ProfitAndLoss[] = [
    {
      description: "Total Income",
      amount: reportsData?.totalIncome || 0,
    },
    {
      description: "Total Expenses",
      amount: reportsData?.totalExpenses || 0,
    },
    {
      description: "Total Customer Loan",
      amount: reportsData?.totalCustomersLoan || 0,
    },
    {
      description: "totalSuppliersLoan",
      amount: reportsData?.totalSuppliersLoan || 0,
    },
  ];

  console.log("reportsData", reportsData);

  // Calculate the total amount for all invoices

  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Profit & Loss Summary</h2>
            </div>
            <div className="py-2 px-4 overflow-hidden">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={data || []}
                columns={tanstackColumns}
                loading={isLoading}
                // paginating={isFetching}
                // pagination={pagination}
                // setPagination={setPagination}
                totalRows={6}
                hidePagination
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLossSummary;
