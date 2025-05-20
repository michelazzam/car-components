import { API } from "@/constants/apiEndpoints";
import { AddEditMakeBody } from "./use-add-make";
import { useUpdateData } from "@/api-service/useUpdateData";

export const useEditMake = ({
  makeId,
  callBackOnSuccess,
}: {
  makeId: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditMakeBody>({
    endpoint: API.editMake(makeId),
    callBackOnSuccess,
    queryKeysToInvalidate: [["makes"]],
  });
};
