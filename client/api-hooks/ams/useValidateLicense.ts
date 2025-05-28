import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useValidateToken = () => {
  return usePostData<{ token: string }>({
    queryKeysToInvalidate: [["ams-license"]],
    endpoint: API.validateLicense,
    hideSuccessToast: true,
  });
};
