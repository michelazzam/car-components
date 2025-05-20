import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { VehicleMakeType } from "@/types/vehicle";

export const useListMakes = () => {
  return useReadData<VehicleMakeType[]>({
    endpoint: API.listMakes,
    queryKey: ["makes"],
  });
};
