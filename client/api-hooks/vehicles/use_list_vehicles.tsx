import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { Pagination } from "@/components/admin/Pagination";

interface Customer {
  _id: string;
  name: string;
}

export type OdometerUnit = "km" | "mile";

export interface Vehicle {
  _id: string;
  number: string;
  make: string;
  model: string;
  lastServiceDate: string;
  odometer: number;
  unit: OdometerUnit;
  customer: Customer;
}

interface VehiclesResponse {
  vehicles: Vehicle[];
  pagination: Pagination;
}

const useListVehicles = ({
  pageSize = 10,
  pageIndex = 0,
  search,
  customerId,
}: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  customerId?: string;
}) => {
  return useReadData<VehiclesResponse>({
    queryKey: ["vehicles", { pageSize, pageIndex, search, customerId }],
    endpoint: API.listVehicles,
    keepPreviousData: true,
    params: { pageSize, pageIndex, search, customerId },
  });
};

export { useListVehicles };
