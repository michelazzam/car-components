import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import React, { useState } from "react";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { createColumnHelper } from "@tanstack/react-table";
import { AddPurchaseItemSchemaType } from "@/lib/apiValidations";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import ReturnItemModal from "./ReturnItemModal";
function AllItemsTable() {
  const [returnItem, setReturnItem] =
    useState<AddPurchaseItemSchemaType | null>(null);
  const {
    formValues: { items },
    removeItem,
    editingPurchase,
  } = usePurchaseFormStore();
  const columnHelper = createColumnHelper<AddPurchaseItemSchemaType>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("description", {
      header: "Description",
    }),
    columnHelper.accessor("price", {
      header: "Unit Price",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("quantity", {
      header: "Qty",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("quantityFree", {
      header: "Qty Free",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("returns", {
      header: "Qty Returned",
      cell: ({ getValue }) => (
        <div>
          {getValue()?.reduce((acc, curr) => acc + curr.quantityReturned, 0) ||
            0}
        </div>
      ),
    }),
    columnHelper.accessor("discount", {
      header: "Discount",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("lotNumber", {
      header: "Lot Number",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("expDate", {
      header: "Exp.Date",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("totalPrice", {
      header: "totalPrice",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div
          className="flex align-middle gap-2"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          {editingPurchase && (
            <button
              onClick={() => {
                setReturnItem(row.original);
              }}
              className=" btn-delete-row text-success bg-success/10 p-2 rounded-md hover:bg-success hover:text-white transition-all"
              data-hs-overlay={`#return-item-modal`}
            >
              <MdOutlineKeyboardReturn />
            </button>
          )}

          <button
            className=" btn-delete-row text-danger"
            onClick={() => {
              removeItem(row.original.itemId);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
    }),
  ];
  return (
    <div className="box mt-4">
      <div className="box-body">
        <ReactTablePaginated
          columns={columns}
          data={items || []}
          totalRows={0}
          loading={false}
          errorMessage={undefined}
          hidePagination
        />
      </div>
      <ReturnItemModal
        returnItem={returnItem}
        setReturnItem={setReturnItem}
        modalTitle="Return Item"
        triggerModalId="return-item-modal"
      />
    </div>
  );
}

export default AllItemsTable;
