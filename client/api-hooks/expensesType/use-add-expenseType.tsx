import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

const useAddExpenseType = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (resp: any) => void;
}) => {
  return usePostData<{ title: string }>({
    queryKeysToInvalidate: [["expenses-type"]],
    endpoint: API.addExpenseType,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddExpenseType };
