import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ReactDOMServer from "react-dom/server";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Search from "../../../components/admin/Search";
import Pagination from "../../../components/admin/Pagination";
import DeleteRecord from "../../../components/admin/DeleteRecord";
import { ReactTabulator } from "react-tabulator";
import { API } from "@/constants/apiEndpoints";
import {
  Customer,
  useListCustomers,
} from "@/api-hooks/customer/use-list-customer";
import CustomerModal from "../../../components/pages/admin/customers/CustomerModal";
import { useRouter } from "next/router";
import { formatNumber } from "@/lib/helpers/formatNumber";
import AddPaymentModal from "@/components/pages/admin/customers/AddPaymentModal";
import { BsCashCoin } from "react-icons/bs";

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: customers } = useListCustomers({
    pageSize: pageSize,
    pageIndex: currentPage - 1,
    search: debouncedSearch,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  const router = useRouter();
  const columns: any = [
    {
      title: "Name",
      field: "name",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Phone Number",
      field: "phoneNumber",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Total Vehicles",
      field: "vehicles",
      headerSort: false,
      formatter: (cell: any) => {
        return ReactDOMServer.renderToString(
          <span> {cell.getValue().length}</span>
        );
      },
    },
    {
      title: "Loan",
      field: "loan",
      headerSort: false,
      formatter: (cell: any) => {
        return ReactDOMServer.renderToString(
          <span>{formatNumber(cell.getValue(), 2)}$</span>
        );
      },
    },
    {
      title: "Actions",
      field: "actions",
      headerSort: false,
      width: 300,
      formatter: () => {
        return ReactDOMServer.renderToString(
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              id="details-btn"
              className="btn btn-sm btn-primary edit-btn text-white border rounded-md p-1 bg-primary hover:brightness-110 hover:text-white"
            >
              Show Details
            </button>
            <button
              id="add-payment"
              data-hs-overlay="#add-payment-modal"
              className="btn btn-sm text-success border border-success rounded-md p-1 hover:bg-success hover:text-white"
              title="add payment"
            >
              <BsCashCoin />
            </button>
            <button
              id="edit-btn"
              className="btn  btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#edit-customer-modal"
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
        const rowData = cell.getRow().getData() as Customer;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          console.log("button Id:", buttonId);
          if (
            buttonId === "edit-btn" ||
            buttonId === "delete-btn" ||
            buttonId === "add-payment"
          ) {
            setSelectedCustomer(rowData);
          } else {
            setSelectedCustomer(rowData);
            router.push({
              pathname: "/admin/customers/details",
              query: {
                customerId: rowData._id,
                cN: rowData.name,
                cP: rowData.phoneNumber,
                cE: rowData.email,
              },
            });
          }
        }
      },
    },
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <div className="w-[20rem]">
                  <Search onChangeSearch={(v) => setSearch(v)} value={search} />
                </div>
              </div>
            </div>
            <div className="box-body space-y-3">
              <div className="overflow-hidden table-bordered">
                <div className="ti-custom-table ti-striped-table ti-custom-table-hover">
                  <ReactTabulator
                    className="table-hover table-bordered"
                    data={customers?.customers}
                    columns={columns}
                  />
                </div>
              </div>
              <Pagination
                pageSize={pageSize}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={customers?.pagination.totalPages || 0}
              />
            </div>
          </div>
        </div>
      </div>

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

      {
        <DeleteRecord
          endpoint={API.deleteCustomer(selectedCustomer?._id || "")}
          queryKeysToInvalidate={[["customers"]]}
        />
      }
    </div>
  );
};

Customers.layout = "Contentlayout";
export default Customers;
