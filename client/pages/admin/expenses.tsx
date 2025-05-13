import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import DeleteRecord from "../../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import { useDebounce } from "@/hooks/useDebounce";
import Search from "../../components/admin/Search";
import DatePicker from "react-datepicker";
import {
  Expense,
  useListExpenses,
} from "@/api-hooks/expenses/use_list_expenses";
import ExpenseModal from "../../components/pages/admin/expenses/ExpenseModal";
import SelectField, {
  SelectOption,
} from "../../components/admin/Fields/SlectField";
import { useListExpensesType } from "@/api-hooks/expensesType/use-list-expensesType";
import { formatDateToISO } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import Checkbox from "../../components/admin/Fields/Checkbox";
import { formatNumber } from "@/lib/helpers/formatNumber";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";

const Expenses = () => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const debouncedSearch = useDebounce(search);

  const { pagination, setPagination } = useReactTablePagination();

  //-----------------API Calls--------------------
  const {
    data: expensesData,
    isFetching,
    isLoading,
    error,
  } = useListExpenses({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    search: debouncedSearch,
    //convert the start date to the format of YYYY-MM-DD
    startDate: formatDateToISO(startDate) || undefined,
    endDate: formatDateToISO(endDate) || undefined,

    expenseTypeId: selectedExpenseType,
  });

  const { data: expensesTypesData } = useListExpensesType();

  //-------------Options-------------------
  const expensesTypesOptions: SelectOption[] = expensesTypesData
    ? expensesTypesData.map((item) => ({
        label: item.name ?? "", // Handle cases where item.title might be undefined
        value: item._id,
      }))
    : [];

  //--------------Select rows--------------------

  const areAllSelected =
    selectedExpenses.length === expensesData?.expenses?.length;
  const handleSelectAll = () => {
    if (areAllSelected) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expensesData?.expenses || []);

      // fetch all invoices from db and set them
    }
  };

  //---------------Create Columns--------------------
  const columnHelper = createColumnHelper<Expense>();
  const tanstackColumns = [
    columnHelper.display({
      id: "select",
      header: () => (
        <div className="flex items-center justify-center">
          <Checkbox
            isChecked={areAllSelected}
            onValueChange={handleSelectAll}
            label={
              selectedExpenses.length ? `(${selectedExpenses.length})` : ""
            }
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              isChecked={selectedExpenses.includes(row.original)}
              onValueChange={(value) => {
                if (value) {
                  setSelectedExpenses([...selectedExpenses, row.original]);
                } else {
                  setSelectedExpenses(
                    selectedExpenses.filter(
                      (invoice) => invoice._id !== row.original._id
                    )
                  );
                }
              }}
            />
          </div>
        );
      },
    }),

    columnHelper.accessor("expenseType.name", {
      header: "Type",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: ({ getValue }) => <div>{formatNumber(getValue(), 2)}$</div>,
    }),
    columnHelper.accessor("note", {
      header: "Note",
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: ({ getValue }) => (
        <div className="w-fit">
          {new Intl.DateTimeFormat("en-US", {
            year: "2-digit", // Use "2-digit" for two-digit year
            month: "short", // Use "short" for abbreviated month name
            day: "2-digit", // Use "2-digit" for two-digit day
          }).format(new Date(getValue()))}
        </div>
      ),
    }),
    columnHelper.accessor("_id", {
      header: "",
      cell: ({ row }) => (
        <div
          className="flex align-middle gap-2"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <button
            id="edit-btn"
            data-hs-overlay="#edit-expense-modal"
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            onClick={() => {
              setSelectedExpense(row.original);
            }}
          >
            <FaRegEdit />
          </button>

          <button
            id="delete-btn"
            data-hs-overlay="#delete-record-modal"
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            onClick={() => {
              setSelectedExpense(row.original);
            }}
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];

  // Calculate the total amount for all invoices or selectedExpenses
  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = expensesData?.expenses?.reduce(
        (acc, expense) => acc + (expense.amount || 0),
        0
      );
      if (selectedExpenses.length !== 0) {
        total = selectedExpenses.reduce(
          (acc, expense) => acc + (expense.amount || 0),
          0
        );
      }
      setTotalAmount(total || 0);
    };

    calculateTotalAmount();
  }, [expensesData, selectedExpenses]);

  return (
    <div>
      <Seo title={"Expenses List"} />
      <Pageheader
        currentpage="Expenses List"
        withBreadCrumbs={false}
        triggerModalId="add-expense-modal"
        buttonTitle="Add Expense"
      />

      {/* Temp using it directly instead of the reusable component since i need to add link to the categories page */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <div className="grid grid-cols-12 space-x-2 items-center">
                <div className="col-span-3 mb-4">
                  <Search
                    placeholder="Search By Note"
                    onChangeSearch={(v) => setSearch(v)}
                    value={search}
                  />
                </div>
                <div className="col-span-3">
                  <SelectField
                    isClearable={true}
                    options={expensesTypesOptions || []}
                    onChangeValue={(v: SelectOption | null) => {
                      if (v && typeof v.value === "string")
                        setSelectedExpenseType(v.value);
                      else setSelectedExpenseType("");
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
              <div className="flex justify-end items-center pb-3">
                <Link
                  href="/admin/expensesType"
                  className="text-blue-500 underline"
                >
                  Manage Expense Types
                </Link>
              </div>
            </div>
            <div className="py-2 px-4">
              <ReactTablePaginated
                errorMessage={error?.message}
                data={expensesData?.expenses || []}
                columns={tanstackColumns}
                loading={isLoading}
                paginating={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalRows={expensesData?.pagination.totalCount || 0}
                renderInTheBottom={
                  <span className="text-success font-bold">
                    Total Amount: {totalAmount} $
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <ExpenseModal
        triggerModalId="edit-expense-modal"
        expense={selectedExpense}
        modalTitle="Edit Expense"
        setSelectedExpense={setSelectedExpense}
      />
      <ExpenseModal
        triggerModalId="add-expense-modal"
        expense={selectedExpense}
        modalTitle="Edit Expense"
        setSelectedExpense={setSelectedExpense}
      />

      <DeleteRecord
        endpoint={API.deleteExpense(selectedExpense?._id || "")}
        queryKeysToInvalidate={[["expenses"]]}
      />
    </div>
  );
};
Expenses.layout = "Contentlayout";

export default Expenses;
