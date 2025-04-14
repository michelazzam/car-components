import Modal from "@/shared/Modal";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, VehicleSchema } from "@/lib/apiValidations";
import TextField from "@/pages/components/admin/FormFields/TextField";
import { Vehicle } from "@/api-hooks/vehicles/use_list_vehicles";
import { useAddVehicle } from "@/api-hooks/vehicles/use_add_vehicle";
import { useEditVehicle } from "@/api-hooks/vehicles/use_edit_vehicle";
import {
  Customer,
  useListCustomers,
} from "@/api-hooks/customer/use-list-customer";
import SelectField from "@/pages/components/admin/FormFields/SelectField";
import { useAddGasType } from "@/api-hooks/gasType/use-add-gasType";
import { GasType, useListGasType } from "@/api-hooks/gasType/use-list-gasTypes";

function VehicleModal({
  vehicle,
  setEditingVehicle,
  triggerModalId,
  modalTitle,
}: {
  vehicle?: Vehicle;
  setEditingVehicle?: React.Dispatch<React.SetStateAction<Vehicle | undefined>>;
  triggerModalId: string;
  modalTitle: string;
  setVehicle?: React.Dispatch<React.SetStateAction<Vehicle | undefined>>;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------

  const [customerSearch, setCustomerSearch] = useState("");
  const { data: customers } = useListCustomers({
    pageIndex: 0,
    search: customerSearch,
  });

  const { mutate: addVehicle, isPending: isAdding } = useAddVehicle({
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editVehicle, isPending: isEditing } = useEditVehicle({
    id: vehicle?._id!,
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const mutation = useAddGasType({
    callBackOnSuccess: (resp: GasType) => {
      setValue("gasTypeId", resp._id);
    },
  });

  const customerOptions = customers?.customers.map((customer: Customer) => {
    return {
      label: customer.name,
      value: customer._id,
    };
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset, setValue } = useForm<VehicleSchema>({
    resolver: zodResolver(apiValidations.VehicleSchema),
    defaultValues: {
      customerId: "",
      model: "",
      gasTypeId: "",
      vehicleNb: "",
    },
  });

  //-----------------------------------Options----------------

  const { data: expenseType } = useListGasType();
  const gasTypeOptions = expenseType?.map((exp) => {
    return {
      label: exp?.title,
      value: exp?._id,
    };
  });

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (vehicle) {
      reset({
        customerId: vehicle?.customer._id,
        model: vehicle.model,
        gasTypeId: vehicle?.gasType._id,
        vehicleNb: vehicle.vehicleNb,
      });
    } else {
      reset({
        customerId: "",
        model: "",
        gasTypeId: "",
        vehicleNb: "",
      });
    }
  }, [vehicle]);

  //---------------------FUNCTIONS-------------------------
  const onSubmit = (data: VehicleSchema) => {
    if (vehicle) editVehicle(data);
    else addVehicle(data);
  };

  const handleCreateOption = (data: string) => {
    mutation.mutate({
      title: data,
    });
  };

  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setEditingVehicle && setEditingVehicle(undefined);
      }}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-12 gap-x-2 items-center"
        >
          <SelectField
            control={control}
            name="customerId"
            label="Customer"
            options={customerOptions || []}
            placeholder={"Select Customer"}
            colSpan={12}
            creatable={false}
            onInputChange={(e) => {
              setCustomerSearch(e);
            }}
          />
          <TextField
            control={control}
            name="model"
            label="Unit Model"
            placeholder="brand name"
            colSpan={6}
          />
          <TextField
            control={control}
            name="vehicleNb"
            label="Vehicle No."
            placeholder="brand name"
            colSpan={6}
          />
          <SelectField
            control={control}
            name="gasTypeId"
            label="Gas Type"
            options={gasTypeOptions || []}
            placeholder={"Select Gas Type"}
            colSpan={12}
            creatable={true}
            handleCreate={handleCreateOption}
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
          disabled={isAdding || isEditing}
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
