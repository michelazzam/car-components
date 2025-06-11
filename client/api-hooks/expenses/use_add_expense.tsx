import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { LoanTransaction } from "../money-transactions/use-list-loans-transactions";
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
  callBackOnSuccess?: (data: { transaction: LoanTransaction }) => void;
}) => {
  return usePostData<AddEditExpenseBodyParam>({
    queryKeysToInvalidate: [["expenses"], ["caisse"], ["purchases"]],
    endpoint: API.addExpense,
    callBackOnSuccess: (data) => {
      callBackOnSuccess?.(data as { transaction: LoanTransaction });
    },
  });
};

export { useAddExpense };
