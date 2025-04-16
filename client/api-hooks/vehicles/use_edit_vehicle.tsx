import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddEditVehicleBodyParam } from "./use_add_vehicle";

const useEditVehicle = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditVehicleBodyParam>({
    queryKeysToInvalidate: [["vehicles"]],
    endpoint: API.editVehicle(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditVehicle };
