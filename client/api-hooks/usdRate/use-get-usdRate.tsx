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
  });

  return { data, error, isLoading };
};

export { useGetUsdRate };
