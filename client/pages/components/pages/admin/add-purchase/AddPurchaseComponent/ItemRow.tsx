import { AddPurchaseItemSchemaType } from "@/lib/apiValidations";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import React from "react";
import { FaTrash } from "react-icons/fa6";

function ItemRow({ product }: { product: AddPurchaseItemSchemaType }) {
  const { deleteProduct } = usePurchase();
  const columns = [
    {
      title: "Product Name",
      value: product.name,
    },
    {
      title: "Description",
      value: product.description,
    },
    {
      title: "Unit Price",
      value: product.price + "$",
    },
    {
      title: "Quantity",
      value: product.quantity,
    },
    {
      title: "Quantity Free",
      value: product.quantityFree,
    },
    {
      title: "Discount",
      value: product.discount + "$",
    },

    {
      title: "Lot",
      value: product.lotNumber,
    },
    {
      title: "Exp.Date",
      value: product.expDate,
    },
  ];

  return (
    <div key={product.itemId} className="flex items-center gap-3 w-full">
      <div
        className="border shadow-sm grid grid-cols-12  p-2 w-full "
        style={{ borderRadius: "8px" }}
      >
        <div
          className="grid grid-cols-5 col-span-10"
          style={{ borderRight: "2px solid #DBE0E6" }}
        >
          {columns.map((column) => (
            <ItemDetailColumn
              title={column.title}
              description={column?.value?.toString() || ""}
            />
          ))}
        </div>
        <div className=" text-center col-span-2 ps-4">
          <p className="text-start text-gray-700">Total</p>
          <p className=" text-black fw-bold lh-1 fs-25 m-1 text-start">
            ${formatNumber(product.totalPrice)}
          </p>
        </div>
      </div>
      <button
        className=" btn-delete-row"
        onClick={() => {
          deleteProduct(product.itemId);
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default ItemRow;

const ItemDetailColumn = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-gray-700">{title}</span>
      <span className="text-black font-bold">{description}</span>
    </div>
  );
};
