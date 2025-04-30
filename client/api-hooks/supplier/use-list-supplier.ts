import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { Pagination } from "@/components/admin/Pagination";

export type Supplier = {
  name: string;
  capital?: string;
  poBox?: string;
  address?: string;
  phoneNumber?: string;
  fax?: string;
  ext?: string;
  email?: string;
  website?: string;
  vatNumber?: string;
  extraInfo?: string;
  //----GET
  _id: string;
  createdAt?: Date;
  loan?: number;
};

const useListSupplier = (params: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}) => {
  return useReadData<SupplierResponse>({
    queryKey: ["suppliers", JSON.stringify(params)],
    endpoint: API.listSupplier,
    params,
  });
};

export { useListSupplier };

type SupplierResponse = {
  suppliers: Supplier[];
  pagination: Pagination;
};
