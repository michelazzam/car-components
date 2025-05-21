"use client";

import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { PiExportLight } from "react-icons/pi";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { useGetGlobalReports } from "@/api-hooks/report/get-global-reports";
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
      description: "Total Suppliers Loan",
      amount: reportsData?.totalSuppliersLoan || 0,
    },
  ];

  // Calculate the total amount for all invoices
  const exportAsExcel = () => {
    const profitAndLoss = data || [];
    if (profitAndLoss.length === 0) return;

    // Map the data to a format suitable for Excel
    const sheetData = profitAndLoss.map((item: any) => ({
      Description: item.description,
      Amount: item.amount,
    }));

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(sheetData);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProfitAndLoss");

    // Write the workbook to a file
    XLSX.writeFile(wb, "profit_and_loss.xlsx");
  };
  return (
    <div className="mt-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-center items-center bg-primary">
              <h2 className="font-bold text-white">Profit & Loss Summary</h2>
            </div>

            <div className="py-2 px-4 overflow-hidden">
              <div className="flex justify-end">
                <button
                  className="ti ti-btn ti-btn-secondary h-fit"
                  onClick={() => {
                    exportAsExcel();
                  }}
                >
                  <PiExportLight size={20} />
                </button>
              </div>
              <ReactTablePaginated
                errorMessage={error?.message}
                data={data || []}
                columns={tanstackColumns}
                loading={isLoading}
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
