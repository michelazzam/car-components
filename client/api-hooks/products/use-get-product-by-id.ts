import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { Product } from "./use-list-products";

export interface PrductSupplierRecord {
  totalQuantity: number;
  totalQuantityFree: number;
  supplierId: string;
  supplierName: string;
}
const useGetProductById = ({ productId }: { productId: string }) => {
  return useReadData<Product>({
    queryKey: ["single-product", productId],
    endpoint: API.getProductById(productId),
    keepPreviousData: true,
    params: { productId },
  });
};

export { useGetProductById };
