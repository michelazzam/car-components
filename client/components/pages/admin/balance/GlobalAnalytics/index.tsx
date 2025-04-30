import { useGetGlobalReports } from "@/api-hooks/report/get-global-reports";
import React from "react";
import TotalCard from "../TotalsAnalytics/TotalCard";
import { formatNumber } from "@/lib/helpers/formatNumber";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuUserPlus,
  LuUserMinus,
} from "react-icons/lu"; // Added additional icons

function GlobalAnalytics() {
  const { data: globalReports, isPending } = useGetGlobalReports();
  const income = globalReports?.totalIncome || 0;
  const expenses = globalReports?.totalExpenses || 0;
  const profit = income - expenses;
  const totalCustomersLoan = globalReports?.totalCustomersLoan || 0;
  const totalSuppliersLoan = globalReports?.totalSuppliersLoan || 0;
  return (
    <div className="grid grid-cols-12 gap-x-4">
      <TotalCard
        variant={"info"}
        isLoadingData={isPending}
        title={"Total Incoming"}
        value={"$" + formatNumber(income, 2)}
        Icon={LuTrendingUp}
      />
      <TotalCard
        variant={"warning"}
        isLoadingData={isPending}
        title={"Total Expenses"}
        value={"$" + formatNumber(expenses, 2)}
        Icon={LuTrendingDown}
      />
      <TotalCard
        isLoadingData={isPending}
        title={"Total Profit"}
        variant={profit > 0 ? "success" : profit < 0 ? "danger" : "info"}
        value={"$" + formatNumber(profit, 2)}
        Icon={LuTrendingUp}
      />
      <TotalCard
        isLoadingData={isPending}
        title={"Total Customer Loan"}
        value={"$" + formatNumber(totalCustomersLoan, 2)}
        Icon={LuUserPlus}
      />
      <TotalCard
        isLoadingData={isPending}
        title={"Total Supplier Loan"}
        value={"$" + formatNumber(totalSuppliersLoan, 2)}
        Icon={LuUserMinus}
      />
    </div>
  );
}

export default GlobalAnalytics;
