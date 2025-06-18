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
import TableWrapper from "@/shared/Table/TableWrapper";
import { formatNumber } from "@/lib/helpers/formatNumber";
import Checkbox from "@/components/admin/Fields/Checkbox";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import ViewReturnedItemsModal from "./ViewReturnedItemsModal";

const PurchaseTable = ({
  selectedSupplier,
}: {
  selectedSupplier?: Supplier;
}) => {
  const { pageIndex, pageSize, pagination, setPagination } =
    useReactTablePagination();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);

  const [showOnlyReturned, setShowOnlyReturned] = useState(false);
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
    onlyReturned: showOnlyReturned === true ? true : undefined,

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

  const columns = [
    columnHelper.accessor("invoiceNumber", {
      header: "Invoice Number",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("invoiceDate", {
      header: "Invoice Date",
    }),

    ...(showOnlyReturned
      ? [
          columnHelper.accessor("items", {
            header: "Returned Items",
            cell: ({ getValue }) => {
              const items = getValue();
              const returnedItems = items.filter(
                (item: any) => item.quantityReturned > 0
              );
              return (
                <div>{returnedItems.map((item) => item.name).join(", ")}</div>
              );
            },
          }),
        ]
      : [
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
        ]),

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
              $ {formatNumber(remainingAmount)}
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
              data-hs-overlay="#add-expense-from-purchase-modal"
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
      cell: ({ row }) => {
        const items = row.original.items;
        const hasReturnedItems = items.some(
          (item: any) => item.returns && item.returns.length > 0
        );
        return (
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            {hasReturnedItems && (
              <button
                id="view-returned-items"
                className="btn btn-sm btn-primary text-primary border-primary border rounded-md p-1 hover:bg-primary hover:text-white transition-all"
                onClick={() => setSelectedPurchase(row.original)}
                data-hs-overlay="#view-returned-items-modal"
              >
                <MdOutlineKeyboardReturn />
              </button>
            )}
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
        );
      },
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
            <div className="">
              <Checkbox
                label="Show only purchases with returned items"
                isChecked={showOnlyReturned}
                onValueChange={(value) => {
                  setShowOnlyReturned(value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="box-body">
          <TableWrapper id="inventory-table" withSearch={false}>
            {" "}
            <div className="overflow-x-auto">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={purchases || []}
                columns={columns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={purchasesResponse?.pagination.totalCount || 0}
              />
            </div>
          </TableWrapper>
        </div>
      </div>

      <DeleteRecord
        endpoint={API.deletePurchase(selectedPurchase?._id || "")}
        queryKeysToInvalidate={[["purchases"]]}
      />
      <ViewPurchaseModal purchase={selectedPurchase} />
      <ExpenseModal
        triggerModalId="add-expense-from-purchase-modal"
        modalTitle="Add Expense"
        purchase={selectedPurchase}
        setPurchase={setSelectedPurchase}
      />
      <ViewReturnedItemsModal
        triggerModalId="view-returned-items-modal"
        modalTitle="Returned Items"
        purchase={selectedPurchase as Purchase}
        setSelectedPurchase={setSelectedPurchase}
      />
    </div>
  );
};

export default PurchaseTable;
