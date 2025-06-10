import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import DatePicker from "react-datepicker";
import { formatDateToISO } from "@/lib/helpers/formatDate";
import { formatDate } from "@/lib/helpers/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import { formatNumber } from "@/lib/helpers/formatNumber";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import Search from "@/components/admin/Search";

import SelectField, {
  SelectOption,
} from "@/components/admin/Fields/SlectField";
import { useListLoansTransactions } from "@/api-hooks/money-transactions/use-list-loans-transactions";
import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import { useListCustomers } from "@/api-hooks/customer/use-list-customer";
import { LoanTransaction } from "@/api-hooks/money-transactions/use-list-loans-transactions";
const LoanTransactionTable = () => {
  const [search, setSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const debouncedSupplierSearch = useDebounce(supplierSearch);
  const debouncedCustomerSearch = useDebounce(customerSearch);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const debouncedSearch = useDebounce(search);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const { pagination, setPagination } = useReactTablePagination();

  //-----------------API Calls--------------------
  const {
    data: transactionsData,
    isFetching,
    isLoading,
    error,
  } = useListLoansTransactions({
    pageIndex: 0,
    pageSize: 30,
    supplierId: selectedSupplierId || undefined,
    customerId: selectedCustomerId || undefined,
    search: debouncedSearch,
    startDate: formatDateToISO(startDate) || undefined,
    endDate: formatDateToISO(endDate) || undefined,
  });

  const { data: suppliersData } = useListSupplier({
    search: debouncedSupplierSearch,
  });
  const { data: customersData } = useListCustomers({
    search: debouncedCustomerSearch,
  });

  //---------------Create Columns--------------------
  const columnHelper = createColumnHelper<LoanTransaction>();
  const tanstackColumns = [
    columnHelper.accessor("customer.name", {
      header: "Customer",
    }),
    columnHelper.accessor("supplier.name", {
      header: "Supplier",
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("loanRemaining", {
      header: "Loan Remaining",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
    }),
  ];

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <div className="grid grid-cols-12 space-x-2 items-center">
                <div className="col-span-3 mb-4">
                  <Search
                    placeholder="Search By details"
                    onChangeSearch={(v) => setSearch(v)}
                    value={search}
                  />
                </div>
                <div className="col-span-3">
                  <SelectField
                    isClearable={true}
                    onInputChange={(v) => setSupplierSearch(v)}
                    options={
                      suppliersData?.suppliers.map((supplier) => ({
                        label: supplier.name,
                        value: supplier._id,
                      })) || []
                    }
                    onChangeValue={(v: SelectOption | null) => {
                      if (v && typeof v.value === "string")
                        setSelectedSupplierId(v.value as string);
                      else setSelectedSupplierId(null);
                    }}
                    placeholder="Filter by Supplier"
                  />
                </div>
                <div className="col-span-3">
                  <SelectField
                    isClearable={true}
                    onInputChange={(v) => setCustomerSearch(v)}
                    options={
                      customersData?.customers.map((customer) => ({
                        label: customer.name,
                        value: customer._id,
                      })) || []
                    }
                    onChangeValue={(v: SelectOption | null) => {
                      if (v && typeof v.value === "string")
                        setSelectedCustomerId(v.value as string);
                      else setSelectedCustomerId(null);
                    }}
                    placeholder="Filter by Customer"
                  />
                </div>

                <div className="col-span-3 mb-4">
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
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update: [Date | null, Date | null]) => {
                          if (update.length === 2) {
                            // Ensure update is an array of two dates
                            const [start, end] = update;
                            setStartDate(start);
                            setEndDate(end);
                          }
                        }}
                        isClearable={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2 px-4">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={transactionsData?.transactions || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={transactionsData?.pagination.totalCount || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanTransactionTable;
