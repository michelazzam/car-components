import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { LoanTransaction } from "../money-transactions/use-list-loans-transactions";

export interface AddPaymentParam {
  customerId: string;
  amount: number;
  discount?: number;
}

const useAddPayment = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (data: { transaction: LoanTransaction }) => void;
}) => {
  return useUpdateData<AddPaymentParam>({
    queryKeysToInvalidate: [["customers"], ["invoices"]],
    endpoint: API.addPayment,
    callBackOnSuccess: (data) => {
      callBackOnSuccess?.(data as { transaction: LoanTransaction });
    },
  });
};

export { useAddPayment };
