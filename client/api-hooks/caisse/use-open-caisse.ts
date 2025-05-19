import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useOpenCaisse = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess: () => void;
}) => {
  return usePostData<{
    amount: number;
  }>({
    queryKeysToInvalidate: [["caisse-history"], ["caisse"]],
    endpoint: API.openCaisse,
    callBackOnSuccess,
  });
};
