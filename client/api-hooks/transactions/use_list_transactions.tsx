import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { Pagination } from "@/components/admin/Pagination";

export type TransactionType = "income" | "outcome";

export interface Transaction {
  _id: string;
  whatHappened: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  type: TransactionType;
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

const useListTransactions = (params: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  transactionType?: TransactionType | null;
  startDate?: string;
  endDate?: string;
}) => {
  return useReadData<TransactionsResponse>({
    queryKey: ["transactions", params],
    endpoint: API.getTransactions,
    keepPreviousData: true,
    params,
  });
};

export { useListTransactions };
