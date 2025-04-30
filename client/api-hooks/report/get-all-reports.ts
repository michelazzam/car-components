import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { Report } from "./get-reports-by-date";
import { Pagination } from "@/components/admin/Pagination";

export interface AllReportsResponse {
  reports: Report[];
  pagination: Pagination;
}

export function useGetAllReports(params: {
  startDate: string;
  endDate: string;
  pageIndex: number;
  pageSize: number;
}) {
  return useReadData<AllReportsResponse>({
    queryKey: ["all-reports", params],
    endpoint: API.getAllReports,
    enabled: params.startDate && params.endDate ? true : false,
    params,
  });
}
