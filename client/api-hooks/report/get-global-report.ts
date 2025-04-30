import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface ReportsResponse {
  totalIncome:number;
  totalExpenses:number;
  totalCustomersLoan:number;
  totalSuppliersLoan:number
}

export function useGetGlobalReports() {
  return useReadData<ReportsResponse>({
    queryKey: ["global-reports"],
    endpoint: API.getAllReports,
  });
}
