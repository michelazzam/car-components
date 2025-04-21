import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Product {
  _id:string;
  name:string;
  supplier:{
    _id:string;
    name:string;
  }
  price:number;
  cost:number;
  quantity:number;
  status:"new" | "used";
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
  items: Product[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
