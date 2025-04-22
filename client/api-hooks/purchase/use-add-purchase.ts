import { usePostData } from "@/api-service/usePostData";
import { API } from "@/constants/apiEndpoints";

export const useAddPurchase = ({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) => {
  return usePostData<AddPurchaseT>({
    endpoint: API.addPurchase,
    queryKeysToInvalidate: [["purchases"]],
    callBackOnSuccess,
  });
};

export type AddPurchaseT = {
  supplierId: string;
  invoiceDate: string;
  invoiceNumber: string;
  customerConsultant: string;
  phoneNumber: string;
  vatPercent: number;
  vatLBP: number;
  totalAmount: number;
  amountPaid: number;
  items: {
    itemId: string;
    description: string;
    price: number;
    quantity: number;
    quantityFree: number;
    discount: number;
    lotNumber: string;
    expDate: string;
    totalPrice: number;
  }[];
};
