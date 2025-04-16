import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Report {
  _id: string;
  date: string;
  totalIncome: number;
  totalExpenses: number;
}

export interface ReportByDateResponse {
  reports: Report[];
  totalIncomeUsd: number;
  totalExpensesUsd: number;
}

export function useGetReportsByDate({
  startDate,
  endDate,
}: {
  //start date in the form of YYYY-MM-DD
  startDate: string;
  //end date in the form of YYYY-MM-DD
  endDate: string;
}) {
  return useReadData<ReportByDateResponse>({
    queryKey: ["reports", startDate, endDate],
    endpoint: API.getReportsByDate,
    params: { startDate, endDate },
    enabled: startDate && endDate ? true : false,
  });
}
