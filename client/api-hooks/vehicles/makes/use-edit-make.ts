import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { AddEditMakeBody } from "./use-add-make";

export const useEditMake = ({
  makeId,
  callBackOnSuccess,
}: {
  makeId: string;
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditMakeBody>({
    endpoint: API.editMake(makeId),
    callBackOnSuccess,
    queryKeysToInvalidate: [["makes"]],
  });
};
