import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "../../api-service/useUpdateData";

export const useChangePassword = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) =>
  useUpdateData({
    endpoint: API.changePassword,
    queryKeysToInvalidate: [["users"]],
    callBackOnSuccess,
  });