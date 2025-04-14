import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "../../api-service/useUpdateData";

export const UseEditUsdRate = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) =>
  useUpdateData({
    endpoint: API.editUsdRate,
    queryKeysToInvalidate: [["usdRate"]],
    callBackOnSuccess,
  });