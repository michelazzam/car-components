import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditVehicleBodyParam {
  customerId: string;
  model: string;
  gasTypeId: string;
  vehicleNb: string;
}

const useAddVehicle = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddEditVehicleBodyParam>({
    queryKeysToInvalidate: [["vehicles"]],
    endpoint: API.addVehicle,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddVehicle };
