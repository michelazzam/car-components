import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "../../api-service/useUpdateData";

export const useEditProfile = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) =>
  useUpdateData({
    endpoint: API.editProfile,
    queryKeysToInvalidate: [["auth"]],
    callBackOnSuccess,
  });
