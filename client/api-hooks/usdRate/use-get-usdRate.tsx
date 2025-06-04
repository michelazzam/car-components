import { useReadData } from "../../api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

interface Data {
  usdRate: number;
}

const useGetUsdRate = () => {
  const { data, error, isLoading } = useReadData<Data>({
    queryKey: ["usdRate"],
    endpoint: API.getUsdRate,
    staleTime: Infinity,
    refetchOnWindowFocus: true,
  });

  return { data, error, isLoading };
};

export { useGetUsdRate };
