import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";
import { AddInvoiceSchema } from "@/lib/apiValidations";

export interface InvoiceSchema {
  driverName: string;
  discount: {
    amount: number;
    type: string;
  };
  paidAmountUsd: number;
  amountPaidLbp: number;
  customerId: string;
  isPaid?: boolean;
  vehicleId: string;
  hasVehicle?: boolean;
  products?: {
    productId: string;
    quantity: number;
  }[];
  services?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  generalNote: string;
  customerNote: string;
  invoiceNumber?: number;
}

const useAddInvoice = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: (data: any) => void;
}) => {
  return usePostData<AddInvoiceSchema>({
    queryKeysToInvalidate: [["invoices"], ["caisse"]],
    endpoint: API.addInvoice,
    callBackOnSuccess: callBackOnSuccess,
  });
};

export { useAddInvoice };
