import { useListCustomers } from "@/api-hooks/customer/use-list-customer";
import { useListVehicles } from "@/api-hooks/vehicles/use_list_vehicles";
import TextField from "@/pages/components/admin/Fields/TextField";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaCarRear } from "react-icons/fa6";
import { IoMdPersonAdd } from "react-icons/io";
import CustomerModal from "../../admin/customers/CustomerModal";
import VehicleModal from "../../admin/vehicles/VehicleModal";
import { useDebounce } from "@/hooks/useDebounce";
import ServiceModal from "../service/ServiceModal";
import { usePosStore } from "@/shared/store/usePosStore";
import SelectFieldControlled from "@/pages/components/admin/FormControlledFields/SelectFieldControlled";

function Header({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  const { editingInvoice } = usePosStore();

  const [customerSearch, setCustomerSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  //------------------Form storage--------------------------
  const formContext = useFormContext();
  if (!formContext) return <div>Loading...</div>;

  const { control, watch, setValue } = formContext;
  const { customerId: customerId } = watch();

  const debouncedSearch = useDebounce(customerSearch);
  const vehiclesDebouncedSearch = useDebounce(vehicleSearch);
  //-------------------APIS Call-----------------------------
  const { data: customers } = useListCustomers({
    pageIndex: 0,
    search: debouncedSearch,
  });

  const { data: vehicles } = useListVehicles({
    customerId: customerId,
    search: vehiclesDebouncedSearch,
  });

  //-------------------------Options--------------------------
  const customerOptions = customers?.customers.map((customer) => {
    return {
      label: customer.name,
      value: customer._id,
      phone: customer.phoneNumber,
      address: customer.address,
      tvaNumber: customer.tvaNumber,
    };
  });

  const vehicleOptions = vehicles?.vehicles.map((vehicle) => {
    return {
      label: vehicle.number,
      value: vehicle._id,
      vehicleNb: vehicle.number,
      model: vehicle.model,
    };
  });
  // If the car is on a page that needs pagination to reach
  if (editingInvoice && editingInvoice.vehicle) {
    vehicleOptions?.push({
      label: editingInvoice.vehicle.number,
      value: editingInvoice.vehicle._id,
      vehicleNb: editingInvoice.vehicle.number,
      model: editingInvoice.vehicle.model,
    });
  }

  return (
    <div>
      {editingInvoice && (
        <h1 className="text-primary font-bold mb-3">Editing invoice </h1>
      )}
      <div className="grid grid-cols-5 gap-5 items-center justify-between pe-2 w-full">
        <div className="col-span-2 flex items-center justify-between w-full">
          <SelectFieldControlled
            control={control}
            label="Customer"
            name="customerId"
            options={customerOptions || []}
            placeholder={"choose customer"}
            creatable={false}
            onInputChange={(e) => {
              setCustomerSearch(e);
              setValue("vehicleId", "");
              setValue("vehicle", {});
            }}
            onObjectChange={(e) => {
              setValue("customer", e);
            }}
          />
          <button
            className="flex items-center justify-end"
            data-hs-overlay="#add-customer-modal"
          >
            <div className="border rounded-sm bg-primary p-1">
              <IoMdPersonAdd className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>

        <div className="col-span-2 flex items-center justify-between w-full">
          <SelectFieldControlled
            control={control}
            label="Vehicle"
            name="vehicleId"
            options={vehicleOptions || []}
            placeholder={`${
              customerId ? "choose vehicle" : "please choose customer first"
            }`}
            colSpan={4}
            creatable={false}
            disabled={customerId ? false : true}
            onInputChange={(e) => {
              setVehicleSearch(e);
            }}
            onObjectChange={(e) => {
              setValue("vehicle", e);
            }}
          />
          <button
            className="col-span-2 flex items-center justify-end"
            data-hs-overlay="#add-vehicle-modal"
          >
            <div className=" border rounded-sm bg-primary p-1">
              <FaCarRear className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>

        <button
          className="rounded-md text-white p-[0.65rem] bg-primary"
          data-hs-overlay="#add-services-modal"
        >
          Add Service
        </button>
      </div>
      <TextField
        placeholder="Search Products"
        colSpan={6}
        value={search}
        onChange={(value) => {
          setSearch(value || "");
        }}
      />
      {/* Add Modal */}
      <CustomerModal
        triggerModalId="add-customer-modal"
        modalTitle="Add Customer"
      />
      <VehicleModal
        triggerModalId="add-vehicle-modal"
        modalTitle="Add Vehicle"
      />
      <ServiceModal
        triggerModalId="add-services-modal"
        modalTitle="Add Services"
      />
    </div>
  );
}

export default Header;
