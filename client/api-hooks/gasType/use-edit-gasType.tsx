import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";


const useEditGasType = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<{title:string}>({
    queryKeysToInvalidate: [["gas-type"]],
    endpoint: API.editGasType(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditGasType };
