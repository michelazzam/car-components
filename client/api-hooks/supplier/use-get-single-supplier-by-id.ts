import { API } from "@/constants/apiEndpoints";
import { useReadData } from "../../api-service/useReadData";
import { Supplier } from "./use-list-supplier";

const useGetSupplierById = ({ supplierId }: { supplierId: string }) => {
  return useReadData<Supplier>({
    queryKey: ["single-supplier", supplierId],
    endpoint: API.getSingleSupplier(supplierId),
    keepPreviousData: true,
  });
};

export { useGetSupplierById };
