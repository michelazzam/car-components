import React, { useEffect, useRef } from "react";
import ItemCard from "./ItemCard";
import { useListProductsInfinite } from "@/api-hooks/products/use-list-products";
import { useInView } from "@/hooks/useInView";
import LoadingAndObservable from "@/components/common/LoadingAndObservable";

function ItemsList({ search }: { search?: string }) {
  const {
    products,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useListProductsInfinite({
    search: search,
    pageSize: 10,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useInView(bottomRef, {
    threshold: 1,
    rootMargin: "150px",
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  useEffect(() => {
    if (isIntersecting && !isFetching) {
      loadMore();
    }
  }, [isIntersecting, loadMore, isFetching]);

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-2  pr-[1.5rem]  flex-grow overflow-y-auto overflow-x-clip">
      {products?.map((product) => (
        <div
          key={product._id}
          className="xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12"
        >
          <ItemCard key={product._id} product={product} />
        </div>
      ))}
      <LoadingAndObservable
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        ref={bottomRef}
        noMoreText="No more products"
      />
    </div>
  );
}

export default ItemsList;
