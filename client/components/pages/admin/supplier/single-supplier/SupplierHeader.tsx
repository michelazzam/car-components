import { Supplier } from "@/api-hooks/supplier/use-list-supplier";
import React from "react";

function SupplierHeader({ supplier }: { supplier: Supplier }) {
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
          <p className="">capital</p>
          <p className="">phoneNumber</p>
          <p className="">vatNumber</p>
          <p className="">loan</p>
        </div>
      </div>
      <div className="box-body">
        <div className="grid grid-cols-5 gap-x-4 text-lg font-bold !text-primary ">
          <p className="">{supplier.name}</p>
          <p className="">{supplier.capital}</p>
          <p className="">{supplier.phoneNumber}</p>
          <p className="">{supplier.vatNumber}</p>
          <p className="">{supplier.loan}</p>
        </div>
      </div>
    </div>
  );
}

export default SupplierHeader;
