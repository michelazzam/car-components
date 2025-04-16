import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { CategorySchema } from "@/lib/apiValidations";

const useAddCategory = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<CategorySchema>({
    queryKeysToInvalidate: [["categories"]],
    endpoint: API.addCategory,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddCategory };
