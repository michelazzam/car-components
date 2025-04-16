import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { SupplierSchema } from "@/lib/apiValidations";

const useAddSupplier = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<SupplierSchema>({
    queryKeysToInvalidate: [["supplier"]],
    endpoint: API.addSupplier,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddSupplier };
