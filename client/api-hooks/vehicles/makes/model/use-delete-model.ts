import { useDeleteData } from "@/api-service/useDeleteData";
import { API } from "@/constants/apiEndpoints";

export const useDeleteModel = ({
  makeId,
  modelId,
  callBackOnSuccess,
}: {
  makeId: string;
  modelId: string;
  callBackOnSuccess?: () => void;
}) => {
  return useDeleteData({
    endpoint: API.deleteModel(makeId, modelId),
    callBackOnSuccess,
    queryKeysToInvalidate: [["models", makeId], ["makes"]],
  });
};
