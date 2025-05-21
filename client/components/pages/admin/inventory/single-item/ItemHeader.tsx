import { Product } from "@/api-hooks/products/use-list-products";
import React from "react";

function ItemHeader({ item }: { item: Product }) {
  //     {
  //     "name": "Fenjen",
  //     "cost": 0,
  //     "price": 15,
  //     "quantity": 103,
  //     "status": "used",
  // }

  return (
    <div className="box mt-4">
      <div className="box-header ">
        <div className="grid grid-cols-5 gap-x-4 w-full text-lg font-semibold text-gray-500">
          <p className="">Name</p>
          <p className="">Cost</p>
          <p className="">Price</p>
          <p className="">Quantity</p>
          <p className="">Status</p>
        </div>
      </div>
      <div className="box-body">
        <div className="grid grid-cols-5 gap-x-4 text-lg font-bold !text-primary ">
          <p className="">{item.name}</p>
          <p className="">{item.cost}</p>
          <p className="">{item.price}</p>
          <p className="">{item.quantity}</p>
          <p className="">{item.status}</p>
        </div>
        <p className="text-gray-600 mt-4">Note: {item.note}</p>
      </div>
    </div>
  );
}

export default ItemHeader;
