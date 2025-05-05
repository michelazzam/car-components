import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { Vehicle } from "../vehicles/use_list_vehicles";
import { Customer } from "./use-list-customer";

export interface SingleCustomer extends Customer {
  vehicles: Vehicle[];
}

const useGetCustomerById = ({ customerId }: { customerId: string }) => {
  return useReadData<SingleCustomer>({
    queryKey: ["single-customer", customerId],
    endpoint: API.getCustomerById(customerId),
    keepPreviousData: true,
  });
};

export { useGetCustomerById };
