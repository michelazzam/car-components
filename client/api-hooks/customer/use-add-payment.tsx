import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";

export interface AddPaymentParam {
  amountPaidUsd: number;
  amountPaidLbp: number;
}

const useAddPayment = ({
  callBackOnSuccess,
  invoiceId,
}: {
  callBackOnSuccess?: () => void;
  invoiceId: string;
}) => {
  return useUpdateData<AddPaymentParam>({
    queryKeysToInvalidate: [["customers"], ["invoices"]],
    endpoint: API.addPayment(invoiceId),
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddPayment };
