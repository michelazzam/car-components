import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { GasType } from "./use-list-gasTypes";

const useAddGasType = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (resp: GasType) => void;

}) => {
  return usePostData<{ title: string }>({
    queryKeysToInvalidate: [["gas-type"]],
    endpoint: API.addGasType,
    callBackOnSuccess: (data: unknown) => {
      // Cast the response to GasType
      if (callBackOnSuccess) {
        callBackOnSuccess(data as GasType);
      }
    },
  });
};

export { useAddGasType };
