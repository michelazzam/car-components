import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditExpenseBodyParam {
  expenseType?: string;
  amount: number;
  date: Date;
  note: string;
}

const useAddExpense = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditExpenseBodyParam>({
    queryKeysToInvalidate: [["expenses"]],
    endpoint: API.addExpense,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddExpense };
