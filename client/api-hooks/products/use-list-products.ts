import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Product {
  _id:string;
  name:string;
  brand:string;
  price:number;
  cost:number;
  stock:number;
  note:string;
}

const useListProducts = ({
  pageSize = 10,
  pageIndex = 0,
  search,

}: {
  pageSize?:number;
  pageIndex?: number;
  search?: string;

}) => {
  return useReadData<ProductResponse>({
    queryKey: ["products", {pageSize, pageIndex, search}],
    endpoint: API.listProducts,
    keepPreviousData: true,
    params: {pageSize, pageIndex, search},
  });
};

export { useListProducts };

export interface ProductResponse {
  products: Product[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
