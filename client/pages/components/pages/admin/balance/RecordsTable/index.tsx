import { useGetAllReports } from "@/api-hooks/report/get-all-reports";
import TableWrapper from "@/shared/Table/TableWrapper";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { ReactTabulator } from "react-tabulator";
import Filters from "./Filters";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { cn } from "@/utils/cn";
import Pagination from "@/pages/components/admin/Pagination";

function RecordsTable() {
  const columns: any = [
    {
      title: "Date",
      field: "date",
      headerSort: false,
      formatter: (cell: any) => {
        return ReactDOMServer.renderToString(
          <div className="w-fit">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(cell.getValue()))}
          </div>
        );
      },
    },
    {
      title: "Total Income",
      field: "totalIncome",
      headerSort: false,
      formatter: (cell: any) => {
        return ReactDOMServer.renderToString(
          <div className="w-fit">${formatNumber(cell.getValue(), 2)}</div>
        );
      },
    },
    {
      title: "Total Expenses",
      field: "totalExpenses",
      headerSort: false,

      formatter: (cell: any) => {
        return ReactDOMServer.renderToString(
          <div className="w-fit">${formatNumber(cell.getValue(), 2)}</div>
        );
      },
    },
    {
      title: "Total Profit",
      field: "",
      headerSort: false,

      formatter: (cell: any) => {
        //calculate profit = totalIncome - totalExpenses
        const totalIncome = cell.getRow().getData().totalIncome;
        const totalExpenses = cell.getRow().getData().totalExpenses;
        const profit = totalIncome - totalExpenses;
        return ReactDOMServer.renderToString(
          <div className={cn("w-fit", profit > 0 ? "text-green" : "text-red")}>
            ${formatNumber(profit, 2)}
          </div>
        );
      },
    },
  ];
  //----------------------------- State -----------------------------
  // here the default start date the first day at the current
  // month and the end date the last day at the current month
  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  //those are used to get the data from the api
  const apiStartDate = startDate ? startDate.toISOString().split("T")[0] : "";
  const apiEndDate = endDate ? endDate.toISOString().split("T")[0] : "";

  const [pageIndex, setPageIndex] = React.useState(1);

  //----------------------------- API Calls -----------------------------
  const { data: reportsData } = useGetAllReports({
    startDate: apiStartDate,
    endDate: apiEndDate,
    pageIndex: pageIndex - 1,
  });

  const records = reportsData?.reports;
  const totalPages = reportsData?.totalPages;

  return (
    <div className="bg-white py-4 px-2">
      <Filters
        setPageIndex={setPageIndex}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <TableWrapper
        withSearch={false}
        // searchValue={searchValue}
        // onSearchValueChange={onSearchValueChange}
      >
        <ReactTabulator
          // height={1000}
          maxHeight={530}
          className="table-hover table-bordered "
          data={records}
          columns={columns}
        />
        <Pagination
          currentPage={pageIndex}
          setCurrentPage={setPageIndex}
          totalPages={totalPages || 0}
        />
      </TableWrapper>
    </div>
  );
}

export default RecordsTable;
