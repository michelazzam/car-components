import { useReadData } from "../../api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export const useCheckLicense = () => {
  return useReadData<{ isValid: true }>({
    queryKey: ["ams-license"],
    endpoint: API.checkLicense,
  });
};
