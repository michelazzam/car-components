import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { useDebounce } from "@/hooks/useDebounce";
import useListInvoicesQueryStrings from "@/shared/helper-hooks/useListInvoicesQueryStrings";

export interface Discount {
  amount: number;
  type: "fixed" | "percentage";
}

export interface GetItem {
  itemRef?: string;
  serviceRef?: string;
  quantity: number;
  name: string;
  price: number;
  cost: number;
  subTotal: number;
  totalPrice: number;
  discount?: Discount;
}

export interface Customer {
  _id?: string;
  name: string;
  phoneNumber?: string;
  tvaNumber?: string;
  address?: string;
  note?: string;
  loan?: number;
  vehicles?: string[];
  createdAt?: string;
}

export interface Vehicle {
  _id: string;
  customer?: string;
  make?: string;
  model: string;
  number: string;
  odometer?: number;
  createdAt?: string;
}

export interface Accounting {
  isPaid: boolean;
  usdRate: number;
  discount: Discount;
  taxesUsd: number;
  subTotalUsd: number;
  totalUsd: number;
  paidAmountUsd: number;
}

export interface Invoice {
  _id: string;
  number: string;
  type: string;
  customer: Customer;
  vehicle?: Vehicle;
  accounting: Accounting;
  customerNote?: string;
  items: GetItem[];
  createdAt: string;
  __v?: number;
}
interface InvoiceResponse {
  invoices: Invoice[];
  flattenedInvoices: FlattenedInvoice[];
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface FlattenedInvoice {
  _id: string;
  number: string;
  type: string;
  customer: Customer;
  vehicle?: Vehicle;
  accounting: Accounting;
  customerNote?: string;
  item: GetItem;
  createdAt: string;
  __v?: number;
}

const useListInvoices = ({
  customerId,
  localPageSize,
  startDateState,
  endDateState,
}: {
  customerId?: string;
  localPageSize?: number | null;
  startDateState?: string;
  endDateState?: string;
}) => {
  const {
    paymentStatus,
    search,
    pageIndex,
    pageSize = 5,
    startDate,
    endDate,
    selectedVehicleId,
  } = useListInvoicesQueryStrings();

  const isPaid = paymentStatus ? paymentStatus === "paid" : undefined;

  const debouncedSearch = useDebounce(search);

  // do not add the startDate/endDate unless they are both provided
  const areBothDatesProvided =
    (startDate &&
      endDate &&
      startDate.toString() !== "" &&
      endDate.toString() !== "") ||
    (startDateState &&
      endDateState &&
      startDateState.toString() !== "" &&
      endDateState.toString() !== "");

  const params = {
    pageIndex: pageIndex,
    search: debouncedSearch?.toString(),
    startDate: areBothDatesProvided
      ? startDateState || startDate?.toString()
      : undefined,
    endDate: areBothDatesProvided
      ? endDateState || endDate?.toString()
      : undefined,
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
