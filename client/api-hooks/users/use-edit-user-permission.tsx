import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { Permissions } from "./use-list-users";

const useEditUserPermissions = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<{
    permissions: Permissions;
  }>({
    queryKeysToInvalidate: [["users"]],
    endpoint: API.editUserPermissions(id),
    callBackOnSuccess,
  });
};
export default useEditUserPermissions;
