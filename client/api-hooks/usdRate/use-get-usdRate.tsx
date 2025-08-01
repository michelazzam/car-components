import { useReadData } from "../../api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import useAuth from "../useAuth";

interface Data {
  usdRate: number;
}

const useGetUsdRate = () => {
  const { user } = useAuth();
  const { data, error, isLoading } = useReadData<Data>({
    queryKey: ["usdRate"],
    endpoint: API.getUsdRate,
    staleTime: Infinity,
    refetchOnWindowFocus: true,
    enabled: !!user,
  });

  return { data, error, isLoading };
};

export { useGetUsdRate };
