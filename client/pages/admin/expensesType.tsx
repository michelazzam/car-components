import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useEffect, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import DeleteRecord from "../../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import Search from "../../components/admin/Search";

import {
  ExpenseType,
  useListExpensesType,
} from "@/api-hooks/expensesType/use-list-expensesType";
import ExpenseTypeModal from "../../components/pages/admin/expenseType/ExpenseTypeModal";
import BackBtn from "@/components/common/BackBtn";

const ExpensesType = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ExpenseType[]>([]);
  const { data: expensesTypesData } = useListExpensesType();
  const [selectedExpenseType, setSelectedExpenseType] = useState<
    ExpenseType | undefined
  >();

  // Filter the expenses data based on the search term
  useEffect(() => {
    if (expensesTypesData) {
      if (search) {
        const filtered = expensesTypesData.filter((item: ExpenseType) =>
          item?.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(expensesTypesData);
      }
    }
  }, [search, expensesTypesData]);

  const columns: any = [
    {
      title: "Name",
      field: "name",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Date",
      field: "createdAt",
      headerSort: true,
      formatter: (cell: any) => {
        const dateValue = new Date(cell.getValue()); // Convert string to Date
        return dateValue.toLocaleString("en-US", {
          year: "2-digit",
          month: "short",
          day: "2-digit",
        });
      },
    },

    {
      title: "Actions",
      field: "actions",
      width: 150,
      headerSort: false,
      formatter: () => {
        return ReactDOMServer.renderToString(
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              id="edit-btn"
              className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#edit-expense-modal"
            >
              <FaRegEdit />
            </button>
            <button
              id="delete-btn"
              className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
              data-hs-overlay="#delete-record-modal"
            >
              <FaRegTrashCan />
            </button>
          </div>
        );
      },

      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as ExpenseType;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn" || buttonId === "delete-btn")
            setSelectedExpenseType(rowData);
        }
      },
    },
  ];

  return (
    <div className="mt-5">
      <BackBtn />

      <Seo title={"Expenses List"} />
      <Pageheader
        currentpage="Expenses Type List"
        withBreadCrumbs={false}
        triggerModalId="add-expense-modal"
        buttonTitle="Add Expense Type"
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <div className="grid grid-cols-12 space-x-2 items-center">
                <div className="col-span-3 mb-4">
                  <Search
                    placeholder="Search By title"
                    onChangeSearch={(v) => setSearch(v)}
                    value={search}
                  />
                </div>
              </div>
            </div>
            <div className="box-body space-y-3">
              <div className="overflow-hidden table-bordered">
                <div className="ti-custom-table ti-striped-table ti-custom-table-hover">
                  <ReactTabulator
                    className="table-hover table-bordered"
                    data={filteredData}
                    columns={columns}
                    options={{
                      maxHeight: 530,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExpenseTypeModal
        triggerModalId="edit-expense-modal"
        expenseType={selectedExpenseType}
        modalTitle="Edit Expense Type"
        setSelectedExpenseType={setSelectedExpenseType}
      />
      <ExpenseTypeModal
        triggerModalId="add-expense-modal"
        expenseType={selectedExpenseType}
        modalTitle="Add Expense Type"
        setSelectedExpenseType={setSelectedExpenseType}
      />

      <DeleteRecord
        endpoint={API.deleteExpenseType(selectedExpenseType?._id || "")}
        queryKeysToInvalidate={[["expenses-type"]]}
      />
    </div>
  );
};
ExpensesType.layout = "Contentlayout";

export default ExpensesType;
