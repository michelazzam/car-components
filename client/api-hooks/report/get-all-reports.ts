import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { Report } from "./get-reports-by-date";

export interface ReportsResponse {
  reports: Report[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function useGetAllReports(params: {
  startDate: string;
  endDate: string;
  pageIndex: number;
}) {
  return useReadData<ReportsResponse>({
    queryKey: ["reports", params],
    endpoint: API.getAllReports,
    params,
  });
}
