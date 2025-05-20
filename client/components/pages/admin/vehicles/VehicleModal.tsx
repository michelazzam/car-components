import Modal from "@/shared/Modal";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, VehicleSchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { Vehicle } from "@/api-hooks/vehicles/use_list_vehicles";
import { useAddVehicle } from "@/api-hooks/vehicles/use_add_vehicle";
import { useEditVehicle } from "@/api-hooks/vehicles/use_edit_vehicle";
import {
  Customer,
  useListCustomers,
} from "@/api-hooks/customer/use-list-customer";
import SelectField from "@/components/admin/Fields/SlectField";

import { SelectOption } from "@/components/admin/Fields/SlectField";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import { TiInfo } from "react-icons/ti";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import { CarMakes, CarModels } from "@/lib/constants/carMakeModalNames";

function VehicleModal({
  vehicle,
  setEditingVehicle,
  triggerModalId,
  modalTitle,
  selectedCustomer,
}: {
  vehicle?: Vehicle;
  setEditingVehicle?: React.Dispatch<React.SetStateAction<Vehicle | undefined>>;
  triggerModalId: string;
  modalTitle: string;
  setVehicle?: React.Dispatch<React.SetStateAction<Vehicle | undefined>>;
  selectedCustomer?: Customer;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);
  //---------------------------STATE--------------------------
  const [selectedCustomerOption, setSelectedCustomerOption] = useState<
    SelectOption | undefined
  >(
    selectedCustomer
      ? {
          label: selectedCustomer.name,
          value: selectedCustomer._id,
        }
      : undefined
  );
  //---------------------------API----------------------------------

  const [customerSearch, setCustomerSearch] = useState("");
  const { data: customers } = useListCustomers({
    pageIndex: 0,
    pageSize: 30,
    search: customerSearch,
  });

  const { mutate: addVehicle, isPending: isAdding } = useAddVehicle({
    customerId: (selectedCustomerOption?.value as string) || "",
    callBackOnSuccess: () => {
      reset();
      setSelectedCustomerOption(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editVehicle, isPending: isEditing } = useEditVehicle({
    customerId: (selectedCustomerOption?.value as string) || "",
    vehicleId: vehicle?._id || "",
    callBackOnSuccess: () => {
      reset();
      setSelectedCustomerOption(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const customerOptions = customers?.customers.map((customer: Customer) => {
    return {
      label: customer.name,
      value: customer._id,
    };
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset, watch, setValue } =
    useForm<VehicleSchema>({
      resolver: zodResolver(apiValidations.VehicleSchema),
      defaultValues: {
        model: "",
        make: "",
        odometer: 0,
        number: "",
        unit: "km",
      },
    });
  const selectedMake = watch("make");

  //-----------------------------------Options----------------

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (vehicle) {
      reset({
        model: vehicle?.model,
        make: vehicle?.make,
        odometer: vehicle?.odometer,
        number: vehicle?.number,
        unit: vehicle?.unit,
      });
    } else {
      reset({
        model: "",
        make: "",
        odometer: 0,
        number: "",
        unit: "km",
      });
    }
  }, [vehicle]);

  //---------------------FUNCTIONS-------------------------
  const onSubmit = (data: VehicleSchema) => {
    if (vehicle) editVehicle(data);
    else addVehicle(data);
  };

  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onOpen={() => {
        if (selectedCustomer) {
          setSelectedCustomerOption({
            label: selectedCustomer.name,
            value: selectedCustomer._id,
          });
        }
      }}
      onClose={() => {
        setEditingVehicle && setEditingVehicle(undefined);
        setSelectedCustomerOption(undefined);
      }}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <div>
          <SelectField
            label="Customer"
            options={customerOptions || []}
            placeholder={"Select Customer"}
            colSpan={12}
            creatable={false}
            onChangeValue={(opt) => {
              if (opt) {
                setSelectedCustomerOption(opt);
              }
            }}
            value={selectedCustomerOption}
            onInputChange={(e) => {
              setCustomerSearch(e);
            }}
          />
          {!selectedCustomerOption && (
            <div className="flex gap-x-2 items-center text-info px-2 py-1.5 bg-info/20 mb-2 rounded-md">
              <TiInfo size={25} />

              <p className=" ">Please Select a Customer First</p>
            </div>
          )}
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-12 gap-x-2 items-center"
        >
          <SelectFieldControlled
            options={CarMakes}
            control={control}
            name="make"
            onChangeValue={(opt) => {
              if (opt) {
                setValue && setValue("model", "");
              }
            }}
            label="Vehicle Make"
            placeholder="brand name"
            colSpan={6}
          />

          <SelectFieldControlled
            options={CarModels[selectedMake] ?? []}
            control={control}
            name="model"
            label="Vehicle Model"
            placeholder="brand name"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="number"
            label="Vehicle No."
            placeholder="123456"
            colSpan={4}
          />
          <SelectFieldControlled
            options={[
              { label: "Km", value: "km" },
              { label: "Mile", value: "mile" },
            ]}
            control={control}
            name="unit"
            label="Odometer Unit"
            placeholder="Km or Mile"
            colSpan={4}
          />
          <NumberFieldControlled
            control={control}
            name="odometer"
            label="Odometer"
            placeholder="123456"
            colSpan={4}
            prefix={watch("unit") + "s "}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          disabled={isAdding || isEditing}
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Cancel
        </button>
        <button
          disabled={isAdding || isEditing || !selectedCustomerOption}
          type="button"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {isAdding || isEditing ? "Submitting..." : "Submit"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default VehicleModal;
