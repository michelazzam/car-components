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
  supplierId,
  enabled = true,
  onlyReturned,
}: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  itemId?: string;
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  enabled?: boolean;
  onlyReturned?: boolean;
}) => {
  return useReadData<PurchaseResponse>({
    queryKey: [
      "purchases",
      {
        pageSize,
        pageIndex,
        search,
        itemId,
        startDate,
        endDate,
        supplierId,
        onlyReturned,
      },
    ],
    endpoint: API.listPurchase,
    keepPreviousData: true,
    enabled,
    params: {
      pageSize,
      pageIndex,
      search,
      itemId,
      startDate,
      endDate,
      supplierId,
      onlyReturned,
    },
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
  subTotal?: number;
  amountPaid: number;
  isPaid: boolean;
  items: [
    {
      itemId: string;
      quantityFree: number;
      discount: number;
      name: string;
      currentItemCost: number;
      quantityReturned?: number;
      description: string;
      price: number;
      quantity: number;
      lotNumber: string;
      expDate: string;
      totalPrice: number;
    }
  ];
};
