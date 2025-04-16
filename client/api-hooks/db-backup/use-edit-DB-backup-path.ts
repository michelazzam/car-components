import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "../../api-service/useUpdateData";

export const useEditDBBackupPath = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) =>
  useUpdateData<{ path: string }>({
    endpoint: API.updateDbBackupPath,
    queryKeysToInvalidate: [["path"]],
    callBackOnSuccess,
  });
