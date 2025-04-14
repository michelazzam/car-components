import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { ExpenseType } from "../expensesType/use-list-expensesType";

export interface Expense {
  _id: string;
  expenseType: ExpenseType;
  date: string;
  amount: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const useListExpenses = (params: {
  pageSize?:number;
  pageIndex?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
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
