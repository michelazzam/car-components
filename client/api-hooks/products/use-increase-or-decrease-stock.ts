import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";

const useIncreaseOrDecreaseStock = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<{ amount: number; action: "increase" | "decrease" }>({
    queryKeysToInvalidate: [["products"]],
    endpoint: API.increaseStock(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useIncreaseOrDecreaseStock };
