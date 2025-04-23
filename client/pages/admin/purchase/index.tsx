import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TableWrapper from "@/shared/Table/TableWrapper";
import React, { useState } from "react";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import { FaRegEdit } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import { FaEye, FaRegTrashCan } from "react-icons/fa6";
import Pagination from "../../components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import DeleteRecord from "../../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import {
  Purchase,
  useListPurchase,
} from "@/api-hooks/purchase/use-list-purchase";
import Link from "next/link";
import { usePurchase } from "@/shared/store/usePurchaseStore";

const PurchasePage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);
  const { setEditingPurchase } = usePurchase();
  const {
    data: purchasesResponse,
    isLoading,
    isFetching,
    error,
  } = useListPurchase({
    pageSize: pageSize,
    pageIndex: pageIndex - 1,
    search: debouncedSearch,
  });
  const purchases = purchasesResponse?.purchases;

  const [selectedPurchase, setSelectedPurchase] = useState<
    Purchase | undefined
  >();

  //---------------Create Columns--------------------
  const columnHelper = createColumnHelper<Purchase>();

  const tanstackColumns = [
    columnHelper.accessor("invoiceNumber", {
      header: "Invoice Number",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

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

  const onSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div>
      <Seo title={"Purchases List"} />
      {/* back btn to the products list */}

      <div className="flex justify-between items-center">
        <Pageheader currentpage="Purchases List" withBreadCrumbs={false} />
        <Link
          className="ti-btn ti-btn-primary-full ti-btn-wave rounded-md"
          href={"/admin/purchase/add-edit-purchase"}
        >
          Add Purchase
        </Link>
      </div>

      <TableWrapper
        id="purchases-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTablePaginated
          errorMessage={error?.message}
          data={purchases || []}
          columns={tanstackColumns}
          hidePagination
          loading={isLoading}
          paginating={isFetching}
          totalRows={purchasesResponse?.pagination.totalCount || 0}
        />

        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={pageIndex}
          setCurrentPage={setPageIndex}
          totalPages={purchasesResponse?.pagination.totalPages || 0}
        />
      </TableWrapper>

      <DeleteRecord
        endpoint={API.deletePurchase(selectedPurchase?._id || "")}
        queryKeysToInvalidate={[["purchases"]]}
      />
    </div>
  );
};

PurchasePage.layout = "Contentlayout";
export default PurchasePage;
