import React, { useState } from "react";
import {
  useListVehicles,
  Vehicle,
} from "@/api-hooks/vehicles/use_list_vehicles";
import { useDebounce } from "@/hooks/useDebounce";
import ReactDOMServer from "react-dom/server";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Search from "../../../../components/admin/Search";
import DeleteRecord from "../../../../components/admin/DeleteRecord";
import { ReactTabulator } from "react-tabulator";
import { API } from "@/constants/apiEndpoints";
import VehicleModal from "../../../../components/pages/admin/vehicles/VehicleModal";
import Link from "next/link";
import SelectField from "@/pages/components/admin/Fields/SlectField";
import { useListCustomers } from "@/api-hooks/customer/use-list-customer";
import { Option } from "react-multi-select-component";
import Pagination from "@/pages/components/admin/Pagination";

const TableVehicles = ({ customerId }: { customerId?: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedCustomerToFilter, setSelectedCustomerToFilter] =
    useState<Option | null>();

  const [search, setSearch] = useState("");
  const debouncedVehicleSearch = useDebounce(search);

  //-------------------APIS Call-----------------------------

  const { data: vehicles } = useListVehicles({
    pageSize: pageSize,
    pageIndex: currentPage - 1,
    search: debouncedVehicleSearch,
    customerId: selectedCustomerToFilter?.value || customerId,
  });

  const [customerSearch, setCustomerSearch] = useState("");
  const debouncedCustomerSearch = useDebounce(customerSearch);
  const { data: customers } = useListCustomers({
    pageIndex: 0,
    search: debouncedCustomerSearch,
  });
  const customerOptions = customers?.customers.map((customer) => {
    return {
      label: customer.name,
      value: customer._id,
    };
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();

  const columns: any = [
    {
      title: "Track No.",
      field: "vehicleNb",
      headerSort: false,
    },

    {
      title: "Customer",
      field: "customer.name",
      sorter: "string",
      headerSort: false,
    },

    {
      title: "Unit Model",
      field: "model",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Gas Type",
      field: "gasType.title",
      sorter: "string",
      headerSort: false,
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
                <div className="mt-3.5 w-[15rem]">
                  <SelectField
                    disabled={!!customerId}
                    label=""
                    options={customerOptions || []}
                    placeholder={
                      customerId ? "Customer selected" : "Filter by customer"
                    }
                    creatable={false}
                    onInputChange={(value) => {
                      setCustomerSearch(value);
                    }}
                    onChangeValue={(opt) => {
                      setSelectedCustomerToFilter(opt);
                    }}
                    value={selectedCustomerToFilter}
                    isClearable
                  />
                </div>
              </div>
              <Link href="/admin/gasType" className="text-blue-500 underline">
                Manage Gas Types
              </Link>
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
                totalPages={vehicles?.totalPages || 0}
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
      />
      {/* Add Modal */}
      <VehicleModal
        setEditingVehicle={setSelectedVehicle}
        triggerModalId="add-vehicle-modal"
        vehicle={selectedVehicle}
        modalTitle="Add Vehicle"
        setVehicle={setSelectedVehicle}
      />

      {selectedVehicle && (
        <DeleteRecord
          endpoint={API.deleteVehicle(selectedVehicle._id)}
          queryKeysToInvalidate={[["vehicles"]]}
        />
      )}
    </>
  );
};

TableVehicles.layout = "Contentlayout";
export default TableVehicles;
