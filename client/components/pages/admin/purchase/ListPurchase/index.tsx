import React, { useState } from "react";

import { API } from "@/constants/apiEndpoints";
import Search from "@/components/admin/Search";
import DatePicker from "react-datepicker";
import DeleteRecord from "@/components/admin/DeleteRecord";
import { FaRegEdit } from "react-icons/fa";
import { FaEye, FaRegTrashCan } from "react-icons/fa6";

import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import { Product } from "@/api-hooks/products/use-list-products";
import useListPurchasesQueryStrings from "@/shared/helper-hooks/useListPurchasesQueryStrings";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import {
  Purchase,
  useListPurchase,
} from "@/api-hooks/purchase/use-list-purchase";
import Link from "next/link";
import TableWrapper from "@/shared/Table/TableWrapper";
import ViewPurchaseModal from "../ViewPurchaseModal";
import { formatDateWithDashes } from "@/lib/helpers/formatDate";

function ListPurchase({
  productId,
  product,
}: {
  productId?: string;
  product?: Product;
}) {
  const { pagination, setPagination } = useReactTablePagination();

  const {
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDates,
  } = useListPurchasesQueryStrings();

  //----TABLE STATES------
  const [selectedPurchase, setSelectedPurchase] = useState<
    Purchase | undefined
  >();
  const { setEditingPurchase } = usePurchaseFormStore();

  //---------------Create Columns--------------------
  const columnHelper = createColumnHelper<Purchase>();

  const tanstackColumns = [
    columnHelper.accessor("invoiceNumber", {
      header: "Invoice Number",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    ...(productId
      ? [
          columnHelper.accessor("items", {
            header: product?.name,
            cell: ({ getValue }) => {
              const item = getValue().find((item) => item.itemId === productId);
              return (
                <div>
                  {item?.quantity}pc / {item?.price}$
                </div>
              );
            },
          }),
          columnHelper.accessor("supplier.name", {
            header: "Supplier",
            cell: ({ getValue }) => {
              return <div>{getValue()}</div>;
            },
          }),
        ]
      : []),

    columnHelper.accessor("invoiceDate", {
      header: "Invoice Date",
    }),

    columnHelper.accessor("customerConsultant", {
      header: "Customer Consultant",
    }),

    columnHelper.accessor("phoneNumber", {
      header: "Phone Number",
    }),

    columnHelper.accessor("vatPercent", {
      header: "VAT Percent",
      cell: ({ getValue }) => <div>{getValue()}%</div>,
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
            id="view-btn"
            className="btn btn-sm btn-primary text-primary border-primary border rounded-md p-1 hover:bg-primary hover:text-white transition-all"
            onClick={() => setSelectedPurchase(row.original)}
            data-hs-overlay="#view-purchase-modal"
          >
            <FaEye />
          </button>{" "}
          <Link
            href={"/admin/purchase/add-edit-purchase"}
            id="edit-btn"
            className="btn btn-sm btn-primary text-secondary border-secondary rounded-md p-1 hover:bg-secondary border hover:text-white transition-all"
            onClick={() => {
              setEditingPurchase(row.original);
            }}
            data-hs-overlay="#edit-purchase-modal"
          >
            <FaRegEdit />
          </Link>
          <button
            id="delete-btn"
            className="btn btn-sm btn-danger text-danger border-danger rounded-md p-1 hover:bg-danger border hover:text-white transition-all"
            data-hs-overlay="#delete-record-modal"
            onClick={() => setSelectedPurchase(row.original)}
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];

  const {
    data: purchasesResponse,
    isLoading,
    isFetching,
    error,
  } = useListPurchase({
    itemId: productId,
    search: search as string,
    startDate: startDate
      ? formatDateWithDashes(new Date(startDate), true) ?? undefined
      : undefined,
    endDate: endDate
      ? formatDateWithDashes(new Date(endDate), true) ?? undefined
      : undefined,
  });

  // for vehicle filter

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-start">
              {/* Filters */}
              <div className="grid gap-x-2 grid-cols-12 items-center">
                <div className="col-span-3">
                  <Search
                    onChangeSearch={(v) => setSearch(v.trim())}
                    value={String(search)}
                    placeholder="Search by notes, vehicle nb, etc"
                  />
                </div>

                <div className="col-span-3 input-group">
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-[#8c9097] dark:text-white/50">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>

                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        placeholderText="Filter by Date"
                        selectsRange={true}
                        startDate={startDate ? new Date(startDate) : undefined}
                        endDate={endDate ? new Date(endDate) : undefined}
                        onChange={(update: [Date, Date]) => {
                          // on clearing
                          if (!update[0] && !update[1]) clearDates();

                          if (update[0]) setStartDate(update[0]);
                          if (update[1]) setEndDate(update[1]);
                        }}
                        isClearable={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TableWrapper id="purchases-table" withSearch={false}>
              <ReactTablePaginated
                errorMessage={error?.message}
                data={purchasesResponse?.purchases || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={purchasesResponse?.pagination.totalCount || 0}
              />
            </TableWrapper>
          </div>
        </div>
      </div>

      <DeleteRecord
        endpoint={API.deletePurchase(selectedPurchase?._id || "")}
        queryKeysToInvalidate={[["purchases"]]}
      />
      <ViewPurchaseModal purchase={selectedPurchase} />
    </div>
  );
}

export default ListPurchase;
