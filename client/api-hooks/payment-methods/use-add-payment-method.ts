import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { PaymentMethod } from "./use-list-payment-method";

export interface AddPaymentMethodBody {
  method: string;
}

export const useAddPaymentMethod = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (res: PaymentMethod) => void;
}) => {
  return usePostData<AddPaymentMethodBody, PaymentMethod>({
    queryKeysToInvalidate: [["payment-methods"]],
    endpoint: API.addPaymentMethod,
    callBackOnSuccess: callBackOnSuccess,
  });
};
