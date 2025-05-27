import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditExpenseBodyParam {
  expenseType?: string;
  amount: number;
  date: string;
  note?: string;
  supplierId?: string;
  purchasesIds?: string[];
}

const useAddExpense = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditExpenseBodyParam>({
    queryKeysToInvalidate: [["expenses"], ["caisse"]],
    endpoint: API.addExpense,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddExpense };
