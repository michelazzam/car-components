import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { AddEditModelToMakeBody } from "./use-add-model-to-make";
export const useEditModel = ({
  makeId,
  modelId,
  callBackOnSuccess,
}: {
  makeId: string;
  modelId: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditModelToMakeBody>({
    endpoint: API.editModel(makeId, modelId),
    callBackOnSuccess,
    queryKeysToInvalidate: [["models", makeId], ["makes"]],
  });
};
