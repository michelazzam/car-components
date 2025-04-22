import { formatNumber } from "@/lib/helpers/formatNumber";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import React from "react";

function ItemRow({ product }: { product: any }) {
  const { deleteProduct } = usePurchase();
  const columns = [
    {
      title: "Product Name",
      value: product.product.label,
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
      value: product.discount + "%",
    },
    {
      title: "VAT",
      value: product.vat + "%",
    },
    {
      title: "Lot",
      value: product.lot,
    },
    {
      title: "Exp.Date",
      value: product.expDate,
    },
  ];

  return (
    <div key={product._id} className="d-flex align-items-center gap-3 ">
      <div
        className="border shadow-sm d-flex align-items-center p-2 w-100 row "
        style={{ borderRadius: "8px" }}
      >
        <div
          className="row row-cols-5 col-10"
          style={{ borderRight: "2px solid #DBE0E6" }}
        >
          {columns.map((column) => (
            <ItemDetailColumn title={column.title} description={column.value} />
          ))}
        </div>
        <div className=" text-center   col-2 ps-4">
          <p className="  fw-normal  lh-1 fs-25 m-1 text-start">Total</p>
          <p className=" text-black fw-bold lh-1 fs-25 m-1 text-start">
            ${formatNumber(product.totalPrice)}
          </p>
        </div>
      </div>
      <button
        className=" btn-delete-row"
        onClick={() => {
          deleteProduct(product._id);
        }}
      >
        <i data-feather="trash-2" className="feather-trash-2"></i>
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
    <div className="d-flex flex-column">
      <span>{title}</span>
      <span className="text-black fw-bold">{description}</span>
    </div>
  );
};
