import { API } from "@/constants/apiEndpoints";
import { useUpdateData } from "@/api-service/useUpdateData";
import { AddPaymentMethodBody } from "./use-add-payment-method";

const useEditPaymentMethod = ({
  id,
  callBackOnSuccess,
}: {
  id: string;
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddPaymentMethodBody>({
    queryKeysToInvalidate: [["payment-methods"]],
    endpoint: API.editPaymentMethod(id),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useEditPaymentMethod };
