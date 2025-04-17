import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { Vehicle } from "../vehicles/use_list_vehicles";

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
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const useListCustomers = ({
  pageSize = 10,
  pageIndex = 0,
  search,
}: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
}) => {
  return useReadData<CustomerResponse>({
    queryKey: ["customers", { pageSize, pageIndex, search }],
    endpoint: API.listCustomers,
    keepPreviousData: true,
    params: { pageSize, pageIndex, search },
  });
};

export { useListCustomers };
