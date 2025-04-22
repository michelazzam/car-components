import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Service {
  _id: string;
  name: string;
  price:number
}

export const useListServices = () => {
  return useReadData<Service[]>({
    queryKey: ["services"],
    endpoint: API.getAllServices,
    keepPreviousData: true
  });
};

// export interface ServiceResponse {
//   services: Service[];
//   pageIndex: number;
//   pageSize: number;
//   totalCount: number;
//   totalPages: number;
// }
