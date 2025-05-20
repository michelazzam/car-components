import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
export const useAddModelToMake = ({
  makeId,
  callBackOnSuccess,
}: {
  makeId: string;
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditModelToMakeBody>({
    endpoint: API.addModelByMakeId(makeId),
    callBackOnSuccess,
  });
};

export type AddEditModelToMakeBody = {
  name: string;
};
