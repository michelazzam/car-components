import { useListCustomers } from "@/api-hooks/customer/use-list-customer";
import { useListVehicles } from "@/api-hooks/vehicles/use_list_vehicles";
import TextField from "@/components/admin/Fields/TextField";
import React, { useState } from "react";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { IoMdPersonAdd } from "react-icons/io";
import CustomerModal from "../../admin/customers/CustomerModal";
import VehicleModal from "../../admin/vehicles/VehicleModal";
import { useDebounce } from "@/hooks/useDebounce";
import ServiceModal from "../service/ServiceModal";
import { usePosStore } from "@/shared/store/usePosStore";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { MdCancel, MdPayment } from "react-icons/md";
import InvoicePaymentMethodModal from "./InvoicePaymentMethodModal";
import Checkbox from "@/components/admin/Fields/Checkbox";
import { HiOutlinePlusSm } from "react-icons/hi";
import { AiOutlineSwap } from "react-icons/ai";
import InvoiceItemsSwapsModal from "./InvoiceItemsSwapsModal";
import { AddInvoiceSchema } from "@/lib/apiValidations";
import { addInvoiceDefaultValues } from "@/pages/add-invoice";
import { FaPlus } from "react-icons/fa6";

function Header({
  search,
  setSearch,
  swapsFieldArrayMethods,
}: {
  search: string;
  setSearch: (search: string) => void;
  swapsFieldArrayMethods: UseFieldArrayReturn<AddInvoiceSchema, "swaps">;
}) {
  const { editingInvoice, setEditingInvoice, clearPosStore } = usePosStore();

  const [customerSearch, setCustomerSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  //------------------Form storage--------------------------
  const formContext = useFormContext<AddInvoiceSchema>();
  if (!formContext) return <div>Loading...</div>;

  const { control, watch, setValue, reset: resetForm } = formContext;
  const { customerId: customerId, hasVehicle } = watch();

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

  const selectedCustomer = customers?.customers?.find(
    (option) => option._id === customerId
  );

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
  // console.log("THE VEHICLE_ID IS CURRENTLY : ", watch("vehicleId"));
  // console.log("THE VEHICLE IS CURRENTLY : ", watch("vehicle"));
  // console.log("VEHICLE OPTIONS ARE : ", vehicleOptions);
  return (
    <div>
      {editingInvoice && (
        <div className="mb-2 py-1 px-2 rounded-md bg-secondary/10 flex justify-between items-center text-secondary ">
          <div className="flex gap-x-2 items-center">
            <BiSolidMessageAltEdit />
            <h1 className=" font-bold ">You are editing an invoice </h1>
          </div>
          <button
            className="flex gap-x-2 items-center"
            onClick={() => {
              setEditingInvoice();
              clearPosStore();
              resetForm(addInvoiceDefaultValues);
            }}
          >
            Cancel Editing
            <MdCancel />
          </button>
        </div>
      )}
      <div className="grid grid-cols-8 gap-5 items-center justify-between pe-2 w-full">
        <div className="col-span-2 flex items-center justify-between w-full">
          <SelectFieldControlled
            AddButton={
              <button
                className="ti ti-btn-secondary ti-btn h-full aspect-square"
                data-hs-overlay="#add-customer-modal"
              >
                <IoMdPersonAdd />
              </button>
            }
            control={control}
            label="Customer"
            name="customerId"
            options={customerOptions || []}
            placeholder={"choose"}
            creatable={false}
            onInputChange={(e) => {
              setCustomerSearch(e);
            }}
            onObjectChange={(e) => {
              setValue("customer", e);
              setValue("vehicleId", "");
              setValue("vehicle", {});
            }}
          />
        </div>

        <div className="col-span-3 flex items-center justify-between w-full">
          <SelectFieldControlled
            AddButton={
              <button
                className="ti ti-btn-secondary ti-btn h-full aspect-square"
                data-hs-overlay="#add-vehicle-modal"
              >
                <HiOutlinePlusSm />
              </button>
            }
            control={control}
            label="Vehicle"
            name="vehicleId"
            options={vehicleOptions || []}
            placeholder={`${
              customerId ? "choose vehicle" : "choose customer first"
            }`}
            colSpan={4}
            creatable={false}
            disabled={!hasVehicle || (customerId ? false : true)}
            onInputChange={(e) => {
              setVehicleSearch(e);
            }}
            onObjectChange={(e) => {
              setValue("vehicle", e);
            }}
          />
        </div>
        <div className="col-span-1">
          <Checkbox
            label="No Vehicle"
            isChecked={!hasVehicle}
            onValueChange={() => setValue("hasVehicle", !hasVehicle)}
          />
        </div>

        <div className="col-span-2 flex gap-x-2 justify-end">
          <button
            className="ti ti-btn-primary ti-btn "
            data-hs-overlay="#add-invoice-items-swaps-modal"
          >
            <AiOutlineSwap />
          </button>

          <button
            className="ti ti-btn-primary ti-btn "
            data-hs-overlay="#add-invoice-payment-method-modal"
          >
            <MdPayment />
          </button>
          <button
            className="ti ti-btn ti-btn-primary flex items-center justify-center"
            data-hs-overlay="#add-services-modal"
          >
            <FaPlus />
            Services
          </button>
        </div>
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
        selectedCustomer={selectedCustomer}
      />
      <ServiceModal
        triggerModalId="add-services-modal"
        modalTitle="Add Services"
      />
      <InvoicePaymentMethodModal
        triggerModalId="add-invoice-payment-method-modal"
        modalTitle="Add Payment Method"
      />
      <InvoiceItemsSwapsModal
        swapsFieldArrayMethods={swapsFieldArrayMethods}
        triggerModalId="add-invoice-items-swaps-modal"
        modalTitle="Swap Items"
      />
    </div>
  );
}

export default Header;
