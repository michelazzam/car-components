import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Service {
  _id: string;
  name: string;
  price:number
}

export const useListServices = ({
  pageIndex = 0,
  search,
}: {
  pageIndex?: number;
  search?: string;
}) => {
  return useReadData<Service[]>({
    queryKey: ["services", { pageIndex, search }],
    endpoint: API.getAllServices,
    keepPreviousData: true,
    params: { pageIndex, search },
  });
};

// export interface ServiceResponse {
//   services: Service[];
//   pageIndex: number;
//   pageSize: number;
//   totalCount: number;
//   totalPages: number;
// }
