import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, MakeSchemaType } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { VehicleMakeType, VehicleModelType } from "@/types/vehicle";
import { useAddModelToMake } from "@/api-hooks/vehicles/makes/model/use-add-model-to-make";
import { useEditModel } from "@/api-hooks/vehicles/makes/model/use-edit-model";

function AddEditModelModal({
  make,
  triggerModalId,
  modalTitle,
  setMake,
  model,
  setModel,
}: {
  make: VehicleMakeType;
  triggerModalId: string;
  modalTitle: string;
  setMake?: React.Dispatch<React.SetStateAction<VehicleMakeType | undefined>>;
  model?: VehicleModelType;
  setModel?: React.Dispatch<React.SetStateAction<VehicleModelType | undefined>>;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: addModel, isPending: isAdding } = useAddModelToMake({
    makeId: make?._id!,
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editModel, isPending: isEditing } = useEditModel({
    makeId: make?._id!,
    modelId: model?._id!,
    callBackOnSuccess: () => {
      reset();
      setMake && setMake(undefined);
      setModel && setModel(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.MakeSchema),
    defaultValues: {
      name: model?.name || "",
    },
  });

  const onSubmit = (data: MakeSchemaType) => {
    if (model) editModel(data);
    else addModel(data);
  };

  useEffect(() => {
    if (model) {
      reset({
        name: model?.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [model]);

  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setMake && setMake(undefined);
        setModel && setModel(undefined);
        reset();
      }}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-12 gap-x-2 items-center"
        >
          <TextFieldControlled
            control={control}
            name="name"
            label="Name"
            placeholder="name"
            colSpan={6}
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

export default AddEditModelModal;
