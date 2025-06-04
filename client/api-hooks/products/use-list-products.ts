import { useInfiniteReadData } from "@/api-service/useInfiniteReadData";
import { useReadData } from "@/api-service/useReadData";
import { Pagination } from "@/components/admin/Pagination";
import { API } from "@/constants/apiEndpoints";

export interface Product {
  _id: string;
  name: string;
  note?: string;
  locationInStore?: string;
  supplier: {
    _id: string;
    name: string;
  };
  price: number;
  cost: number;
  quantity: number;
  status: "new" | "used";
  totalPrice: number;
  totalCost: number;
  profitOrLoss: number;
}

const useListProducts = ({
  pageSize = 10,
  pageIndex = 0,
  search,
}: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
}) => {
  return useReadData<ProductResponse>({
    queryKey: ["products", { pageSize, pageIndex, search }],
    endpoint: API.listProducts,
    keepPreviousData: true,
    params: { pageSize, pageIndex, search },
  });
};

export interface ProductResponse {
  items: Product[];
  pagination: Pagination;
}

const useListProductsInfinite = (params: {
  search?: string;
  pageSize?: number;
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteReadData<ProductResponse>({
    queryKey: ["products", params],
    endpoint: API.listProducts,
    keepPreviousData: true,
    initialPageParam: 0,
    params: {
      ...params,
      paginationType: "cursor",
    },
  });

  const products = data?.pages.flatMap((page) => page.items) || [];
  const pagination = data?.pages[data?.pages.length - 1].pagination || {};

  return {
    products,
    pagination,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  };
};

export { useListProducts, useListProductsInfinite };
