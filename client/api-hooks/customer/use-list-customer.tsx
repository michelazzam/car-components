import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { Vehicle } from "../vehicles/use_list_vehicles";
import { Pagination } from "@/components/admin/Pagination";
import useAuth from "../useAuth";

export interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  tvaNumber: string;
  note: string;
  loan: number;
  createdAt: string;
  updatedAt: string;
  vehicles: Vehicle[];
  __v: number;
}

interface CustomerResponse {
  customers: Customer[];
  pagination: Pagination;
}

const useListCustomers = ({
  pageSize = 10,
  pageIndex = 0,
  search,
  onlyHasLoan,
}: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  onlyHasLoan?: boolean;
}) => {
  const { user } = useAuth();
  return useReadData<CustomerResponse>({
    queryKey: ["customers", { pageSize, pageIndex, search, onlyHasLoan }],
    endpoint: API.listCustomers,
    enabled: !!user && user.permissions.Customers.read,
    keepPreviousData: true,
    params: { pageSize, pageIndex, search, onlyHasLoan },
  });
};

export { useListCustomers };
