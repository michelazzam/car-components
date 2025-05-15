import { useReadData } from "@/api-service/useReadData";
import { Supplier } from "../supplier/use-list-supplier";
import { API } from "@/constants/apiEndpoints";
import { Pagination } from "@/components/admin/Pagination";

const useListPurchase = ({
  itemId,
  pageSize = 10,
  pageIndex = 0,
  search,
  startDate,
  endDate,
}: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  itemId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useReadData<PurchaseResponse>({
    queryKey: [
      "purchases",
      { pageSize, pageIndex, search, itemId, startDate, endDate },
    ],
    endpoint: API.listPurchase,
    keepPreviousData: true,
    params: { pageSize, pageIndex, search, itemId, startDate, endDate },
  });
};

export { useListPurchase };

interface PurchaseResponse {
  purchases: Purchase[];
  pagination: Pagination;
}
export type Purchase = {
  _id: string;
  supplier: Supplier;
  invoiceNumber: string;
  invoiceDate: string;
  customerConsultant: string;
  phoneNumber: string;
  vatPercent: number;
  vatLBP: number;
  totalAmount: number;
  amountPaid: number;
  items: [
    {
      itemId: string;
      quantityFree: number;
      discount: number;
      name: string;
      currentItemCost: number;
      description: string;
      price: number;
      quantity: number;
      lotNumber: string;
      expDate: string;
      totalPrice: number;
    }
  ];
};
