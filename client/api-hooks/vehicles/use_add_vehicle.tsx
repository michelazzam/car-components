import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export interface AddEditVehicleBodyParam {
  make: string;
  model: string;
  odometer?: number;
  number: string;
}

const useAddVehicle = ({
  callBackOnSuccess,
  customerId,
}: {
  callBackOnSuccess?: () => void;
  customerId: string;
}) => {
  return usePostData<AddEditVehicleBodyParam>({
    queryKeysToInvalidate: [["vehicles"], ["single-customer"]],
    endpoint: API.addVehicle(customerId),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddVehicle };
