import { API } from "@/constants/apiEndpoints";
import { AddEditProductBodyParam } from "./use-add-product";
import { useUpdateData } from "@/api-service/useUpdateData";

const useEditProduct = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddEditProductBodyParam>({
    queryKeysToInvalidate: [["products"]],
    endpoint: API.editProduct(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditProduct };
