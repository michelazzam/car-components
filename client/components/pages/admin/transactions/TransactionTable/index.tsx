import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import DatePicker from "react-datepicker";
import { formatDateToISO } from "@/lib/helpers/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import { formatNumber } from "@/lib/helpers/formatNumber";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import Search from "@/components/admin/Search";
import {
  Transaction,
  TransactionType,
  useListTransactions,
} from "@/api-hooks/transactions/use_list_transactions";
import SelectField, {
  SelectOption,
} from "@/components/admin/Fields/SlectField";

const TransactionTable = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const debouncedSearch = useDebounce(search);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<TransactionType | null>(null);

  const { pagination, setPagination } = useReactTablePagination();

  //-----------------API Calls--------------------
  const {
    data: transactionsData,
    isFetching,
    isLoading,
    error,
  } = useListTransactions({
    pageIndex: 0,
    pageSize: 30,
    transactionType: selectedTransactionType,
    search: debouncedSearch,
    startDate: formatDateToISO(startDate) || undefined,
    endDate: formatDateToISO(endDate) || undefined,
  });

  //---------------Create Columns--------------------
  const columnHelper = createColumnHelper<Transaction>();
  const tanstackColumns = [
    columnHelper.accessor("type", {
      header: "Type",
    }),
    columnHelper.accessor("totalAmount", {
      header: "Total",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("discountAmount", {
      header: "Discount",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("finalAmount", {
      header: "Final",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("whatHappened", {
      header: "Details",
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
                    options={[
                      { label: "Income", value: "income" },
                      { label: "Outcome", value: "outcome" },
                    ]}
                    onChangeValue={(v: SelectOption | null) => {
                      if (v && typeof v.value === "string")
                        setSelectedTransactionType(v.value as TransactionType);
                      else setSelectedTransactionType(null);
                    }}
                    placeholder="Filter by Type"
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

export default TransactionTable;
