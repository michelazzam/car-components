import React, { useState } from "react";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import { FaCheckCircle, FaRegEdit } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import { FaEye, FaRegTrashCan } from "react-icons/fa6";
import { useDebounce } from "@/hooks/useDebounce";
import { API } from "@/constants/apiEndpoints";
import {
  Purchase,
  useListPurchase,
} from "@/api-hooks/purchase/use-list-purchase";
import Link from "next/link";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import ViewPurchaseModal from "@/components/pages/admin/purchase/ViewPurchaseModal";
import Search from "@/components/admin/Search";
import SelectField, {
  SelectOption,
} from "@/components/admin/Fields/SlectField";
import {
  Supplier,
  useListSupplier,
} from "@/api-hooks/supplier/use-list-supplier";
import ExpenseModal from "@/components/pages/admin/expenses/ExpenseModal";
import { cn } from "@/utils/cn";
import DeleteRecord from "@/components/admin/DeleteRecord";

const PurchaseTable = ({
  selectedSupplier,
}: {
  selectedSupplier?: Supplier;
}) => {
  const { pageIndex, pageSize, pagination, setPagination } =
    useReactTablePagination();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);

  const [selectedSupplierOption, setSelectedSupplierOption] = useState<
    SelectOption | undefined
  >();
  const [supplierSearch, setSupplierSearch] = useState("");
  const debouncedSupplierSearch = useDebounce(supplierSearch);

  const { data: suppliersData } = useListSupplier({
    pageIndex: 0,
    pageSize: 30,
    search: debouncedSupplierSearch,
  });
  const {
    data: purchasesResponse,
    isLoading,
    isFetching,
    error,
  } = useListPurchase({
    pageSize: pageSize,
    pageIndex: pageIndex,
    search: debouncedSearch,
    supplierId:
      selectedSupplier?._id || (selectedSupplierOption?.value as string),
  });
  const purchases = purchasesResponse?.purchases;

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

    columnHelper.accessor("invoiceDate", {
      header: "Invoice Date",
    }),
    columnHelper.accessor("supplier.name", {
      header: "Supplier Name",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("customerConsultant", {
      header: "Customer Consultant",
    }),

    columnHelper.accessor("phoneNumber", {
      header: "Phone",
      cell: ({ getValue }) => {
        const phone = getValue();

        return <div>{phone && phone.length > 0 ? phone : "---"}</div>;
      },
    }),

    columnHelper.accessor("vatPercent", {
      header: "VAT",
      cell: ({ getValue }) => <div>{getValue()}%</div>,
    }),

    columnHelper.accessor("totalAmount", {
      header: "Remaining",
      cell: ({ cell }) => {
        const totalAmount = cell.getValue();
        const amountPaid = cell.row.original.amountPaid;
        const remainingAmount = totalAmount - amountPaid;
        return (
          <div>
            <div
              className={cn(
                "text-lg font-bold",
                remainingAmount >= 0 ? "text-success" : "text-danger"
              )}
            >
              $ {remainingAmount}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("isPaid", {
      header: "Payment",
      cell: ({ getValue, row }) => (
        <div className="flex items-center justify-center">
          {getValue() ? (
            <FaCheckCircle className="text-success" />
          ) : (
            <button
              onClick={() => {
                setSelectedPurchase(row.original);
              }}
              data-hs-overlay="#add-expense-modal"
              className="ti ti-btn ti-btn-primary ti-btn-wave rounded-md"
            >
              Pay Now
            </button>
          )}
        </div>
      ),
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
      meta: {
        sticky: "right",
        stickyClassName:
          "sticky right-0 bg-white shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
      },
    }),
  ];

  return (
    <div>
      <div className="box ">
        <div className="box-header ">
          <div className="flex gap-x-2 items-center">
            <Search
              value={searchValue}
              onChangeSearch={(v) => setSearchValue(v)}
            />
            {!selectedSupplier && (
              <SelectField
                width="w-[20rem]"
                marginBottom="mb-0 -mt-1"
                isClearable
                options={
                  suppliersData?.suppliers.map((supplier: any) => ({
                    label: supplier.name,
                    value: supplier._id,
                  })) || []
                }
                placeholder={"Filter by supplier"}
                onChangeValue={(opt) => {
                  if (opt) {
                    setSelectedSupplierOption(opt);
                  } else {
                    setSelectedSupplierOption(undefined);
                  }
                }}
                value={selectedSupplierOption}
                onInputChange={(e) => {
                  setSupplierSearch(e);
                }}
              />
            )}
          </div>
        </div>
        <div className="box-body">
          <ReactTablePaginated
            errorMessage={error?.message}
            data={purchases || []}
            columns={tanstackColumns}
            loading={isLoading}
            paginating={isFetching}
            pagination={pagination}
            setPagination={setPagination}
            totalRows={purchasesResponse?.pagination.totalCount || 0}
          />
        </div>
      </div>

      <DeleteRecord
        endpoint={API.deletePurchase(selectedPurchase?._id || "")}
        queryKeysToInvalidate={[["purchases"]]}
      />
      <ViewPurchaseModal purchase={selectedPurchase} />
      <ExpenseModal
        triggerModalId="add-expense-modal"
        modalTitle="Add Expense"
        purchase={selectedPurchase}
        setPurchase={setSelectedPurchase}
      />
    </div>
  );
};

export default PurchaseTable;
