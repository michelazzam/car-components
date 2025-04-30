import React from "react";
import ItemCard from "./ItemCard";
import { Product } from "@/api-hooks/products/use-list-products";

function ItemsList({ products }: { products?: Product[] }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-2  pr-[1.5rem] ">
      {products?.map((product) => (
        <div className="xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12">
          <ItemCard key={product._id} product={product} />
        </div>
      ))}
    </div>
  );
}

export default ItemsList;
