import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteRecord from "../../../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import {
  Customer,
  useListCustomers,
} from "@/api-hooks/customer/use-list-customer";
import CustomerModal from "../../../components/pages/admin/customers/CustomerModal";
import { useRouter } from "next/router";
import { formatNumber } from "@/lib/helpers/formatNumber";
import AddPaymentModal from "@/components/pages/admin/customers/AddPaymentModal";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import { createColumnHelper } from "@tanstack/react-table";
import TableWrapper from "@/shared/Table/TableWrapper";
import { BsCashCoin } from "react-icons/bs";
import { SelectOption } from "@/components/admin/Fields/SlectField";
import { extractBooleanFromString } from "@/lib/helpers/extractBooleanFromString";

const Customers = () => {
  const { pagination, setPagination } = useReactTablePagination();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>({
    label: "All",
    value: "all",
  });
  const onlyHasLoanOptions: SelectOption[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Has loan",
      value: "true",
    },
    {
      label: "No loan",
      value: "false",
    },
  ];

  const {
    data: customersResponse,
    error,
    isLoading,
    isFetching,
  } = useListCustomers({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    search: debouncedSearch,
    onlyHasLoan: extractBooleanFromString(selectedOption?.value as string),
  });
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  const router = useRouter();

  const columnHelper = createColumnHelper<Customer>();

  const tanstackColumns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("loan", {
      header: "Loan",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("vehicles", {
      header: "Total Vehicles",
      cell: ({ getValue }) => <div>{getValue().length}</div>,
    }),

    columnHelper.accessor("phoneNumber", {
      header: "Phone Number",
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
            id="details-btn"
            onClick={() => {
              router.push({
                pathname: "/admin/customers/details",
                query: {
                  customerId: row.original._id,
                  cN: row.original.name,
                  cP: row.original.phoneNumber,
                  cE: row.original.email,
                },
              });
            }}
            className="btn btn-sm btn-primary edit-btn text-white border rounded-md p-1 bg-primary hover:brightness-110 hover:text-white"
          >
            Show Details
          </button>
          <button
            id="add-payment"
            onClick={() => setSelectedCustomer(row.original)}
            data-hs-overlay="#add-payment-modal"
            className="btn btn-sm text-success border border-success rounded-md p-1 hover:bg-success hover:text-white"
            title="add payment"
          >
            <BsCashCoin />
          </button>
          <button
            id="edit-btn"
            onClick={() => setSelectedCustomer(row.original)}
            className="btn  btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            data-hs-overlay="#edit-customer-modal"
          >
            <FaRegEdit />
          </button>
          <button
            id="delete-btn"
            onClick={() => setSelectedCustomer(row.original)}
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
      <Seo title={"Customer List"} />
      <Pageheader
        buttonTitle="Add New customer"
        currentpage="Customer List"
        withBreadCrumbs={false}
        triggerModalId="add-customer-modal"
      />

      <TableWrapper
        id="customers-table"
        searchValue={search}
        onSearchValueChange={setSearch}
        select={{
          options: onlyHasLoanOptions,
          value: selectedOption,
          onChange: (value) => {
            setSelectedOption(value);
          },
        }}
      >
        <ReactTablePaginated
          errorMessage={error?.message}
          data={customersResponse?.customers || []}
          columns={tanstackColumns}
          loading={isLoading}
          paginating={isFetching}
          pagination={pagination}
          setPagination={setPagination}
          totalRows={customersResponse?.pagination.totalCount || 0}
        />
      </TableWrapper>

      {/* Edit Modal */}
      <CustomerModal
        triggerModalId="edit-customer-modal"
        customer={selectedCustomer}
        modalTitle="Edit Customer"
        setCustomer={setSelectedCustomer}
      />

      {/* Add Modal */}
      <CustomerModal
        triggerModalId="add-customer-modal"
        customer={undefined}
        modalTitle="Add Customer"
        setCustomer={setSelectedCustomer}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        triggerModalId="add-payment-modal"
        selectedCustomer={selectedCustomer}
        modalTitle="Add payment in USD"
      />

      <DeleteRecord
        endpoint={API.deleteCustomer(selectedCustomer?._id || "")}
        queryKeysToInvalidate={[["customers"]]}
      />
    </div>
  );
};

Customers.layout = "Contentlayout";
export default Customers;
