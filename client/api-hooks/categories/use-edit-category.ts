import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { CategorySchema } from "@/lib/apiValidations";

const useEditCategory = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<CategorySchema>({
    queryKeysToInvalidate: [["categories"]],
    endpoint: API.editCategory(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditCategory };
