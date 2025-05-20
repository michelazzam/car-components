import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { VehicleModelType } from "@/types/vehicle";
export const useAddModelToMake = ({
  makeId,
  callBackOnSuccess,
}: {
  makeId: string;
  callBackOnSuccess?: (m: VehicleModelType) => void;
}) => {
  return usePostData<AddEditModelToMakeBody, VehicleModelType>({
    endpoint: API.addModelByMakeId(makeId),
    callBackOnSuccess,
    queryKeysToInvalidate: [["makes"], ["models"], [makeId]],
  });
};

export type AddEditModelToMakeBody = {
  name: string;
};
