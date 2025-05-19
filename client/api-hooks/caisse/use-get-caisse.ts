import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export const useGetCaisse = () => {
  return useReadData<{
    isCaisseOpen: boolean;
    caisse: number;
  }>({
    queryKey: ["caisse"],
    endpoint: API.getCaisse,
  });
};
