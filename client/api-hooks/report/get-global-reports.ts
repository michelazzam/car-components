import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface GlobalReportsResponse {
  totalIncome: number;
  totalExpenses: number;
  totalCustomersLoan: number;
  totalSuppliersLoan: number;
}

export function useGetGlobalReports() {
  return useReadData<GlobalReportsResponse>({
    queryKey: ["global-reports"],
    endpoint: API.getGlobalReports,
  });
}
