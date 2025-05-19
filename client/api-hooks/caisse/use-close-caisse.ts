import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useCloseCaisse = () => {
  return usePostData<{
    amount: number;
  }>({
    endpoint: API.closeCaisse,
    queryKeysToInvalidate: [["caisse-history"], ["caisse-status"]],
  });
};
