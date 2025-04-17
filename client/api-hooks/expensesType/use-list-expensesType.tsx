import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface ExpenseType {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const useListExpensesType = () => {
  return useReadData<ExpenseType[]>({
    queryKey: ["expenses-type"],
    endpoint: API.listExpensesType,
    keepPreviousData: true,
  });
};

export { useListExpensesType };
