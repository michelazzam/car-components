import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { VehicleMakeType } from "@/types/vehicle";

export const useListMakeModels = ({ makeId }: { makeId: string }) => {
  return useReadData<VehicleMakeType>({
    endpoint: API.singleMake(makeId),
    queryKey: ["models", makeId],
  });
};
