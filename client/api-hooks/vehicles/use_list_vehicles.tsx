import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";

interface Customer {
  _id: string;
  name: string;
}

interface GasType {
  _id: string;
  title: string;
}

export interface Vehicle {
  _id: string;
  vehicleNb: string;
  model: string;
  gasType: GasType;
  lastServiceDate: string;
  odoMeter: string;
  customer: Customer;
}

interface VehiclesResponse {
  vehicles: Vehicle[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
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
