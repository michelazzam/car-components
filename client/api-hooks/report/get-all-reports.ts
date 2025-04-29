import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface ReportsResponse {
  totalIncome:number;
  totalExpenses:number;
  totalCustomersLoan:number;
  totalSuppliersLoan:number
}

export function useGetAllReports() {
  return useReadData<ReportsResponse>({
    queryKey: ["reports"],
    endpoint: API.getAllReports,
  });
}
