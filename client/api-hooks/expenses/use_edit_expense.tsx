import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddEditExpenseBodyParam } from "./use_add_expense";

const useEditExpense = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditExpenseBodyParam>({
    queryKeysToInvalidate: [["expenses"]],
    endpoint: API.editExpense(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditExpense };
