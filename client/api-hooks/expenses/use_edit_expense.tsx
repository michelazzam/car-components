import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddEditExpenseBodyParam } from "./use_add_expense";
import { LoanTransaction } from "../money-transactions/use-list-loans-transactions";
const useEditExpense = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: (data: { transaction: LoanTransaction }) => void;
}) => {
  return useUpdateData<AddEditExpenseBodyParam>({
    queryKeysToInvalidate: [["expenses"], ["caisse"]],
    endpoint: API.editExpense(id),
    callBackOnSuccess: (data) => {
      callBackOnSuccess?.(data as { transaction: LoanTransaction });
    },
  });
};

export { useEditExpense };
