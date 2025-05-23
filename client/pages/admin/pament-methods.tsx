import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import {
  Product,
  useListProducts,
} from "@/api-hooks/products/use-list-products";

import { API } from "@/constants/apiEndpoints";
import { useDebounce } from "@/hooks/useDebounce";

import { createColumnHelper } from "@tanstack/react-table";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import TableWrapper from "@/shared/Table/TableWrapper";
import AddEditProductModal from "@/components/pages/admin/menu/AddEditProductModal";
import IncreaseStockModal from "@/components/pages/admin/inventory/IncreaseStock";
import DecreaseStockModal from "@/components/pages/admin/inventory/DecreaseStock";
import DeleteRecord from "@/components/admin/DeleteRecord";
import Link from "next/link";

const PaymentMethods = () => {
  const { pagination, setPagination } = useReactTablePagination();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, error, isLoading, isFetching } = useListProducts({
    search: debouncedSearch,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const columnHelper = createColumnHelper<Product>();
  const tanstackColumns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),

    columnHelper.accessor("supplier.name", {
      header: "Supplier",
    }),

    columnHelper.accessor("price", {
      header: "Price",
      cell: ({ getValue }) => (
        <div>
          {getValue().toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      ),
    }),

    columnHelper.accessor("quantity", {
      header: "Quantity",
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
            href={`/admin/inventory/${row.original._id}`}
            className="btn btn-sm btn-primary delete-btn text-primary border border-primary rounded-md p-1 hover:bg-primary hover:text-white"
          >
            Show Details
          </Link>

          <button
            id="edit-btn"
            onClick={() => setSelectedProduct(row.original)}
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            data-hs-overlay="#edit-product-modal"
          >
            <FaRegEdit />
          </button>
          <button
            id="delete-btn"
            onClick={() => setSelectedProduct(row.original)}
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            data-hs-overlay="#delete-record-modal"
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div>
      <Seo title={"Inventory List"} />
      <Pageheader
        buttonTitle="Add Product"
        currentpage="Inventory List"
        withBreadCrumbs={false}
        triggerModalId="add-product-modal"
      />

      <TableWrapper
        id="inventory-table"
        searchValue={search}
        onSearchValueChange={setSearch}
      >
        <ReactTablePaginated
          errorMessage={error?.message}
          data={data?.items || []}
          columns={tanstackColumns}
          loading={isLoading}
          paginating={isFetching}
          pagination={pagination}
          setPagination={setPagination}
          totalRows={data?.pagination.totalCount || 0}
        />
      </TableWrapper>

      {/* Edit Modal */}
      <AddEditProductModal
        triggerModalId="edit-product-modal"
        product={selectedProduct}
        modalTitle="Edit Product"
        setProduct={setSelectedProduct}
      />
      {/* Add Modal */}
      <AddEditProductModal
        triggerModalId="add-product-modal"
        product={undefined}
        modalTitle="Add Product"
        setProduct={setSelectedProduct}
      />

      <IncreaseStockModal productId={selectedProduct?._id || ""} />
      <DecreaseStockModal product={selectedProduct} />

      {selectedProduct && (
        <DeleteRecord
          endpoint={API.deleteProduct(selectedProduct._id)}
          queryKeysToInvalidate={[["products"]]}
        />
      )}
    </div>
  );
};
PaymentMethods.layout = "Contentlayout";

export default PaymentMethods;
