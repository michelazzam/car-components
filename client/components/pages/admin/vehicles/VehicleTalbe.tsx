import React, { useState } from "react";
import {
  useListVehicles,
  Vehicle,
} from "@/api-hooks/vehicles/use_list_vehicles";
import { useDebounce } from "@/hooks/useDebounce";
import ReactDOMServer from "react-dom/server";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Search from "../../../admin/Search";
import DeleteRecord from "../../../admin/DeleteRecord";
import { ReactTabulator } from "react-tabulator";
import { API } from "@/constants/apiEndpoints";
import VehicleModal from "./VehicleModal";
import { Customer } from "@/api-hooks/customer/use-list-customer";
import Pagination from "@/components/admin/Pagination";

const TableVehicles = ({ customer }: { customer: Customer }) => {
  if (!customer) {
    return (
      <div className="flex justify-center items-center">
        No customer data available
      </div>
    );
  }
  const { _id: customerId } = customer;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const debouncedVehicleSearch = useDebounce(search);

  //-------------------APIS Call-----------------------------

  const { data: vehicles } = useListVehicles({
    pageSize: pageSize,
    pageIndex: currentPage - 1,
    search: debouncedVehicleSearch,
    customerId: customerId,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();

  const columns: any = [
    {
      title: "Vehicle No.",
      field: "number",
      headerSort: false,
    },

    {
      title: "Odometer",
      field: "odometer",
      sorter: "string",
      headerSort: false,
    },

    {
      title: "Type",
      field: "make",
      sorter: "string",
      headerSort: false,
      formatter: (cell: any) => {
        const vehicle = cell.getRow().getData() as Vehicle;
        const make = vehicle?.make;
        const model = vehicle?.model;
        return ReactDOMServer.renderToString(
          <div>
            {make}
            {model && ","}
            {model}
          </div>
        );
      },
    },

    {
      title: "Last Service Date",
      field: "lastServiceDate",
      sorter: "string",
      headerSort: false,
      formatter: (cell: any) => {
        const value = cell.getValue();
        return ReactDOMServer.renderToString(
          <div>
            {value
              ? new Date(value).toLocaleString("en-US", {
                  year: "2-digit", // Use "2-digit" for two-digit year
                  month: "short", // Use "short" for abbreviated month name
                  day: "2-digit", // Use "2-digit" for two-digit day
                })
              : "--No Service Yet--"}
          </div>
        );
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
              data-hs-overlay="#edit-vehicle-modal"
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
        const rowData = cell.getRow().getData() as Vehicle;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn" || buttonId === "delete-btn")
            setSelectedVehicle(rowData);
        }
      },
    },
  ];

  return (
    <>
      {/* Temp using it directly instead of the reusable component since i need to add link to the gas types page */}
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
                  {vehicles && vehicles?.vehicles?.length > 0 ? (
                    <ReactTabulator
                      className="table-hover table-bordered"
                      data={vehicles?.vehicles}
                      columns={columns}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-48">
                      No Vehicles Yet
                    </div>
                  )}
                </div>
              </div>
              <Pagination
                pageSize={pageSize}
                setPageSize={setPageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={vehicles?.pagination.totalPages || 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <VehicleModal
        setEditingVehicle={setSelectedVehicle}
        triggerModalId="edit-vehicle-modal"
        vehicle={selectedVehicle}
        modalTitle="Edit Vehicle"
        setVehicle={setSelectedVehicle}
        selectedCustomer={customer}
      />
      {/* Add Modal */}
      <VehicleModal
        setEditingVehicle={setSelectedVehicle}
        triggerModalId="add-vehicle-modal"
        vehicle={selectedVehicle}
        modalTitle="Add Vehicle"
        setVehicle={setSelectedVehicle}
        selectedCustomer={customer}
      />

      {selectedVehicle && (
        <DeleteRecord
          endpoint={API.deleteVehicle(selectedVehicle._id, customerId)}
          queryKeysToInvalidate={[["vehicles"]]}
        />
      )}
    </>
  );
};

TableVehicles.layout = "Contentlayout";
export default TableVehicles;
