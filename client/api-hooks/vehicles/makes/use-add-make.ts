import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useAddMake = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditMakeBody>({
    endpoint: API.addMake,
    callBackOnSuccess,
    queryKeysToInvalidate: [["makes"]],
  });
};

export type AddEditMakeBody = {
  name: string;
};
