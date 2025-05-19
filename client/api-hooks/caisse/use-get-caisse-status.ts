import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export const useGetCaisseStatus = () => {
  return useReadData<{
    amount: number;
  }>({
    queryKey: ["caisse-status"],
    endpoint: API.getCaisseStatus,
  });
};
