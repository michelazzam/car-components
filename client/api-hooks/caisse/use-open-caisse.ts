import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useOpenCaisse = () => {
  return usePostData<{
    amount: number;
  }>({
    queryKeysToInvalidate: [["caisse-history"], ["caisse-status"]],
    endpoint: API.openCaisse,
  });
};
