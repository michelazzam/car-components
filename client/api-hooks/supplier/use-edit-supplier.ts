import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { CategorySchema } from "@/lib/apiValidations";

const useEditSupplier = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<CategorySchema>({
    queryKeysToInvalidate: [["supplier"]],
    endpoint: API.editSupplier(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditSupplier };
