import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { VehicleMakeType } from "@/types/vehicle";

export const useAddMake = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (d: VehicleMakeType) => void;
}) => {
  return usePostData<AddEditMakeBody, VehicleMakeType>({
    endpoint: API.addMake,
    callBackOnSuccess,
    queryKeysToInvalidate: [["makes"]],
  });
};

export type AddEditMakeBody = {
  name: string;
};
