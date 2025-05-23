import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface PaymentMethod {
  _id: string;
  method: string;
  note?: string;
}

export const useListPaymentMethods = () => {
  return useReadData<PaymentMethod[]>({
    queryKey: ["payment-methods"],
    endpoint: API.listPaymentMethod,
    keepPreviousData: true,
  });
};
