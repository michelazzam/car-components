import { formatNumber } from "@/lib/helpers/formatNumber";
import { ReactTablePaginated } from "@/shared/ReactTablePaginated";
import TableWrapper from "@/shared/Table/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { PrductSupplierRecord } from "@/api-hooks/products/use-get-product-by-id";
function SuppliersTable({
  suppliers,
  isLoading = false,
}: {
  suppliers: PrductSupplierRecord[];
  isLoading?: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");

  const columnHelper = createColumnHelper<PrductSupplierRecord>();

  const tanstackColumns = [
    columnHelper.accessor("supplierName", {
      header: "Supplier Name",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("totalQuantity", {
      header: "Total Quantity",
      cell: ({ getValue }) => {
        const value = Number(getValue());
        return <div>{formatNumber(value, 2)}</div>;
      },
    }),

    columnHelper.accessor("totalQuantityFree", {
      header: "Total Quantity Free",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
  ];

  const onSearchValueChange = (value: string) => {
    setSearchValue(value);
  };
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (searchValue === "") {
      return supplier;
    }
    return supplier?.supplierName
      ?.toLowerCase()
      .includes(searchValue.toLowerCase());
  });

  return (
    <div>
      <TableWrapper
        id="supplier-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTablePaginated
          data={filteredSuppliers || []}
          columns={tanstackColumns}
          loading={isLoading}
          hidePagination
          totalRows={filteredSuppliers.length}
        />
      </TableWrapper>
    </div>
  );
}

export default SuppliersTable;
