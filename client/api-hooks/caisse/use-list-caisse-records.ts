import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export const useGetCaisse = () => {
  return useReadData<{
    amount: number;
  }>({
    queryKey: ["caisse-history"],
    endpoint: API.listCaisse,
  });
};
