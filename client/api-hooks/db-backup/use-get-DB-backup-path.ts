import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export default function useGetDBBackupPath() {
  return useReadData<{ path: string }>({
    queryKey: ["path"],
    endpoint: API.getDbBackupPath,
  });
}
