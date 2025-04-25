import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";

export interface AddPaymentParam {
  customerId: string;
  amount: number;
}

const useAddPayment = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return useUpdateData<AddPaymentParam>({
    queryKeysToInvalidate: [["customers"], ["invoices"]],
    endpoint: API.addPayment,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddPayment };
