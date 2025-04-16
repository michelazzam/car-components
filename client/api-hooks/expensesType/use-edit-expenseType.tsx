import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";


const useEditExpenseType = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<{title:string}>({
    queryKeysToInvalidate: [["expenses-type"]],
    endpoint: API.editExpenseType(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditExpenseType };
