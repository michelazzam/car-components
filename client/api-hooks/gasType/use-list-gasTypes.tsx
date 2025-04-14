import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface GasType {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const useListGasType = () => {
  return useReadData<GasType[]>({
    queryKey: ["gas-type"],
    endpoint: API.listGasType,
    keepPreviousData: true,
  });
};

export { useListGasType };
