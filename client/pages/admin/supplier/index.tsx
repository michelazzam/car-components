import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TableWrapper from "@/shared/Table/TableWrapper";
import React, { useState } from "react";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import { FaRegEdit } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import { FaEye, FaPerson, FaRegTrashCan } from "react-icons/fa6";
import {
  Supplier,
  useListSupplier,
} from "@/api-hooks/supplier/use-list-supplier";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { useDebounce } from "@/hooks/useDebounce";
import { API } from "@/constants/apiEndpoints";
import AddEditSupplierModal from "@/components/pages/admin/supplier/AddEditSupplierModal";
import ViewSupplierModal from "@/components/pages/admin/supplier/ViewSupplierModal";
import DeleteRecord from "@/components/admin/DeleteRecord";
import Link from "next/link";

const SupplierPage = () => {
  const { pagination, setPagination } = useReactTablePagination();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);

  const {
    data: suppliersResponse,
    isLoading,
    isFetching,
    error,
  } = useListSupplier({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    search: debouncedSearch,
  });
  const suppliers = suppliersResponse?.suppliers;

  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();

  //---------------Create Columns--------------------
  const columnHelper = createColumnHelper<Supplier>();

  const tanstackColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("loan", {
      header: "Loan",
      cell: ({ getValue }) => {
        const value = Number(getValue());
        return <div>{formatNumber(value, 2)}$</div>;
      },
    }),

    columnHelper.accessor("capital", {
      header: "Capital",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("poBox", {
      header: "PO Box",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("phoneNumber", {
      header: "Phone Number",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("vatNumber", {
      header: "VAT Number",
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
          <Link
            id="view-btn"
            className="btn btn-sm btn-primary text-primary border-primary border rounded-md p-1 hover:bg-primary hover:text-white transition-all"
            href={`/admin/supplier/${row.original._id}`}
          >
            <FaPerson />
          </Link>{" "}
          <button
            id="view-btn"
            className="btn btn-sm btn-primary text-primary border-primary border rounded-md p-1 hover:bg-primary hover:text-white transition-all"
            onClick={() => setSelectedSupplier(row.original)}
            data-hs-overlay="#view-supplier-modal"
          >
            <FaEye />
          </button>{" "}
          <button
            id="edit-btn"
            className="btn btn-sm btn-primary text-secondary border-secondary rounded-md p-1 hover:bg-secondary border hover:text-white transition-all"
            onClick={() => setSelectedSupplier(row.original)}
            data-hs-overlay="#edit-supplier-modal"
          >
            <FaRegEdit />
          </button>
          <button
            id="delete-btn"
            className="btn btn-sm btn-danger text-danger border-danger rounded-md p-1 hover:bg-danger border hover:text-white transition-all"
            data-hs-overlay="#delete-record-modal"
            onClick={() => setSelectedSupplier(row.original)}
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
      <Seo title={"Suppliers List"} />
      {/* back btn to the products list */}

      <Pageheader
        buttonTitle="Add supplier"
        currentpage="Suppliers List"
        withBreadCrumbs={false}
        triggerModalId="add-supplier-modal"
      />

      <TableWrapper
        id="supplier-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTablePaginated
          errorMessage={error?.message}
          data={suppliers || []}
          columns={tanstackColumns}
          pagination={pagination}
          setPagination={setPagination}
          loading={isLoading}
          paginating={isFetching}
          totalRows={suppliersResponse?.pagination.totalCount || 0}
        />
      </TableWrapper>

      <AddEditSupplierModal triggerModalId="add-supplier-modal" />
      <AddEditSupplierModal
        triggerModalId="edit-supplier-modal"
        supplier={selectedSupplier}
      />
      <ViewSupplierModal
        triggerModalId="view-supplier-modal"
        supplier={selectedSupplier}
      />
      <DeleteRecord
        endpoint={API.deleteSupplier(selectedSupplier?._id || "")}
        queryKeysToInvalidate={[["suppliers"]]}
      />
    </div>
  );
};

SupplierPage.layout = "Contentlayout";
export default SupplierPage;
