import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { VehicleMakeType } from "@/types/vehicle";

export const useAddMake = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddMakeBody>({
    endpoint: API.addMake,
    callBackOnSuccess,
  });
};

export type AddMakeBody = Omit<
  VehicleMakeType,
  "models" | "totalModels" | "id"
>;
