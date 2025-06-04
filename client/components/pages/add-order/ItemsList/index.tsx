import React from "react";
import ItemCard from "./ItemCard";
import { useListProductsInfinite } from "@/api-hooks/products/use-list-products";

function ItemsList({ search }: { search?: string }) {
  const { products } = useListProductsInfinite({
    search: search,
    pageSize: 100,
  });

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
    </div>
  );
}

export default ItemsList;
