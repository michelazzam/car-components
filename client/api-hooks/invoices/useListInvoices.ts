import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { useDebounce } from "@/hooks/useDebounce";
import { Item } from "@/shared/store/usePosStore";
import useListInvoicesQueryStrings from "@/shared/helper-hooks/useListInvoicesQueryStrings";

export interface ProductItem {
  name?: string;
  price?: number;
  product?: {
    name: string;
    price: number;
  };
  quantity: number;
}

export interface ServiceItem {
  name: string;
  quantity?: number;
  price: number;
}
export interface Invoice {
  _id: string;
  driverName: string;
  generalNote: string;
  customerNote: string;
  invoiceNumber: number;
  discount: {
    amount: number;
    type: "fixed" | "percentage";
  };
  isPaid: boolean;
  customer: {
    _id: string;
    name: string;
    loan: number;
    loanLbp: number;
    phone?: string;
    address?: string;
    tvaNumber?: string;
  };
  vehicle: {
    _id: string;
    vehicleNb: string;
    model: string;
  };
  products?: Item[];
  services?: Item[];
  usdRate?: number;
  totalPriceUsd: number;
  totalPriceLbp: number;
  finalPriceUsd: number;
  paidAmountUsd: number;
  taxesLbp: number;
  createdBy: {
    fullName: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface InvoiceResponse {
  invoices: Invoice[];
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const useListInvoices = ({
  customerId,
  localPageSize,
}: {
  customerId?: string;
  localPageSize?: number | null;
}) => {
  const {
    paymentStatus,
    search,
    pageIndex,
    pageSize,
    startDate,
    endDate,
    selectedVehicleId,
  } = useListInvoicesQueryStrings();

  const isPaid = paymentStatus ? paymentStatus === "paid" : undefined;

  const debouncedSearch = useDebounce(search);

  // do not add the startDate/endDate unless they are both provided
  const areBothDatesProvided =
    startDate &&
    endDate &&
    startDate.toString() !== "" &&
    endDate.toString() !== "";

  const params = {
    pageIndex: pageIndex,
    search: debouncedSearch?.toString(),
    startDate: areBothDatesProvided && startDate?.toString(),
    endDate: areBothDatesProvided && endDate?.toString(),
    customerId: customerId,
    pageSize: localPageSize ?? pageSize,
    isPaid: isPaid,
    vehicleId: selectedVehicleId,
  };

  return useReadData<InvoiceResponse>({
    queryKey: ["invoices", params],
    endpoint: API.listInvoices,
    keepPreviousData: true,
    params,
  });
};

export { useListInvoices };
