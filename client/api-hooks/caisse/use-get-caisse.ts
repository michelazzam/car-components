import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import useAuth from "../useAuth";

export const useGetCaisse = () => {
  const { user } = useAuth();
  return useReadData<{
    isCaisseOpen: boolean;
    caisse: number;
  }>({
    queryKey: ["caisse"],
    endpoint: API.getCaisse,
    enabled: !!user,
  });
};
