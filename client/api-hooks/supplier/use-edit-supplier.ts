import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { CreateSupplier } from "./use-Add-supplier";

const useEditSupplier = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<CreateSupplier>({
    queryKeysToInvalidate: [["suppliers"]],
    endpoint: API.editSupplier(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditSupplier };
