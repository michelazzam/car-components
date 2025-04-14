import React from "react";
import TotalCard from "./TotalCard";
import { LuWallet } from "react-icons/lu";
import { ReportByDateResponse } from "@/api-hooks/report/get-reports-by-date";
import { formatNumber } from "@/lib/helpers/formatNumber";

function TotalsAnalytics({
  totals,
  isPending,
}: {
  totals: ReportByDateResponse | undefined;
  isPending: boolean;
}) {
  const expenses = totals?.totalExpensesUsd || 0;
  const income = totals?.totalIncomeUsd || 0;
  const profit = income - expenses;

  return (
    <div className="grid grid-cols-12 gap-x-4">
      <TotalCard
        isLoadingData={isPending}
        title={"Total Incoming"}
        value={"$" + formatNumber(income, 2)}
        Icon={LuWallet}
      />
      <TotalCard
        isLoadingData={isPending}
        title={"Total Expenses"}
        value={"$" + formatNumber(expenses, 2)}
        Icon={LuWallet}
      />
      <TotalCard
        isLoadingData={isPending}
        title={"Total Profit"}
        value={"$" + formatNumber(profit, 2)}
        Icon={LuWallet}
      />
    </div>
  );
}

export default TotalsAnalytics;
