import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "../../api-service/useUpdateData";

export const useEditUser = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) =>
  useUpdateData({
    endpoint: API.editUsers(id),
    queryKeysToInvalidate: [["users"]],
    callBackOnSuccess,
  });
