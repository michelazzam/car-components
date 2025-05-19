import { useReadData } from "@/api-service/useReadData";
import { Pagination } from "@/components/admin/Pagination";
import { API } from "@/constants/apiEndpoints";

export const useListCaisseRecords = (params: {
  pageIndex: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
}) => {
  return useReadData<{
    caisseHistory: CaisseHistoryRecord[];
    pagination: Pagination;
  }>({
    queryKey: ["caisse-history", params],
    endpoint: API.listCaisse,
    params,
  });
};

export type CaisseHistoryRecord = {
  _id: string;
  date: string;
  closedAmount: number;
  openedAmount: number;
  closedAt: string | null;
  openedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
