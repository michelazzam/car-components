import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { ExpenseType } from "../expensesType/use-list-expensesType";
import { Pagination } from "@/components/admin/Pagination";
import { Supplier } from "../supplier/use-list-supplier";

export interface Expense {
  _id: string;
  expenseType: ExpenseType;
  date: string;
  amount: number;
  note: string;
  supplier?: Supplier;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  pagination: Pagination;
}

const useListExpenses = (params: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  expenseTypeId?: string;
}) => {
  return useReadData<ExpensesResponse>({
    queryKey: ["expenses", params],
    endpoint: API.listExpenses,
    keepPreviousData: true,
    params,
  });
};

export { useListExpenses };
