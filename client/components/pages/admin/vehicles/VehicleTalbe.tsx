import React, { useState } from "react";
import {
  useListVehicles,
  Vehicle,
} from "@/api-hooks/vehicles/use_list_vehicles";
import { useDebounce } from "@/hooks/useDebounce";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import DeleteRecord from "../../../admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import VehicleModal from "./VehicleModal";
import { Customer } from "@/api-hooks/customer/use-list-customer";
import {
  ReactTablePaginated,
  useReactTablePagination,
} from "@/shared/ReactTablePaginated";
import TableWrapper from "@/shared/Table/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";

const TableVehicles = ({ customer }: { customer: Customer }) => {
  const { _id: customerId } = customer;

  const [search, setSearch] = useState("");
  const debouncedVehicleSearch = useDebounce(search);

  const { pagination, setPagination } = useReactTablePagination();

  const {
    data: vehiclesResponse,
    error,
    isLoading,
    isFetching,
  } = useListVehicles({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    search: debouncedVehicleSearch,
    customerId: customerId,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();

  const columnHelper = createColumnHelper<Vehicle>();
  const tanstackColumns = [
    columnHelper.accessor("number", {
      header: "Vehicle No.",
      cell: ({ getValue }) => <div>{getValue()}</div>,
    }),
    columnHelper.accessor("odometer", {
      header: "Odometer",
      cell: ({ row, getValue }) => (
        <>
          {getValue()} {row.original.unit}
        </>
      ),
    }),
    columnHelper.accessor("make", {
      header: "Type",
      cell: ({ row }) => (
        <div>
          {row.original.make} {row.original.model && ","}
          {row.original.model}
        </div>
      ),
    }),
    columnHelper.accessor("lastServiceDate", {
      header: "Last Service Date",
      cell: ({ getValue }) => (
        <div className="w-fit">
          {getValue()
            ? new Intl.DateTimeFormat("en-US", {
                year: "2-digit", // Use "2-digit" for two-digit year
                month: "short", // Use "short" for abbreviated month name
                day: "2-digit", // Use "2-digit" for two-digit day
              }).format(new Date(getValue()))
            : "--No Service Yet--"}
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
            data-hs-overlay="#edit-vehicle-modal"
            className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
            onClick={() => {
              setSelectedVehicle(row.original);
            }}
          >
            <FaRegEdit />
          </button>

          <button
            id="delete-btn"
            data-hs-overlay="#delete-record-modal"
            className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
            onClick={() => {
              setSelectedVehicle(row.original);
            }}
          >
            <FaRegTrashCan />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <>
      <TableWrapper
        id="customer-vehicles-table"
        searchValue={search}
        onSearchValueChange={setSearch}
      >
        <ReactTablePaginated
          errorMessage={error?.message}
          data={vehiclesResponse?.vehicles || []}
          columns={tanstackColumns}
          loading={isLoading}
          paginating={isFetching}
          pagination={pagination}
          setPagination={setPagination}
          totalRows={vehiclesResponse?.pagination.totalCount || 0}
        />
      </TableWrapper>

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
