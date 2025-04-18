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
    endpoint: API.editUser(id),
    queryKeysToInvalidate: [["users"]],
    callBackOnSuccess,
  });
