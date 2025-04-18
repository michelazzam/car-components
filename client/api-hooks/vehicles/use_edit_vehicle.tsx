import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddEditVehicleBodyParam } from "./use_add_vehicle";

const useEditVehicle = ({
  customerId,
  vehicleId,
  callBackOnSuccess,
}: {
  customerId: string;
  vehicleId: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditVehicleBodyParam>({
    queryKeysToInvalidate: [["vehicles"]],
    endpoint: API.editVehicle(vehicleId, customerId),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditVehicle };
