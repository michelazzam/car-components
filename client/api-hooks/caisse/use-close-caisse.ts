import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useCloseCaisse = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess: () => void;
}) => {
  return usePostData<{
    amount: number;
  }>({
    endpoint: API.closeCaisse,
    queryKeysToInvalidate: [["caisse-history"], ["caisse"]],
    callBackOnSuccess,
  });
};
