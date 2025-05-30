import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import React from "react";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { createColumnHelper } from "@tanstack/react-table";
import { AddPurchaseItemSchemaType } from "@/lib/apiValidations";
import { FaTrash } from "react-icons/fa6";
function AllItemsTable() {
  const {
    formValues: { items },
    removeItem,
  } = usePurchaseFormStore();
  const columnHelper = createColumnHelper<AddPurchaseItemSchemaType>();
  console.log("ITEMS ARE : ", items);
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
      header: "Quantity",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("quantityFree", {
      header: "Quantity Free",
      cell: ({ getValue }) => <div>{getValue()}</div>,
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
    </div>
  );
}

export default AllItemsTable;
