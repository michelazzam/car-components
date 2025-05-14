import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";
import { Product } from "./use-list-products";

export interface SingleProductResponse {
  item: Product;
  suppliers: PrductSupplierRecord[];
}
export interface PrductSupplierRecord {
  totalQuantity: number;
  totalQuantityFree: number;
  supplierId: string;
  supplierName: string;
}
const useGetProductById = ({ productId }: { productId: string }) => {
  return useReadData<SingleProductResponse>({
    queryKey: ["single-product", productId],
    endpoint: API.getProductById(productId),
    keepPreviousData: true,
    params: { productId },
  });
};

export { useGetProductById };
