import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, MakeSchemaType } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { VehicleMakeType } from "@/types/vehicle";
import { useAddMake } from "@/api-hooks/vehicles/makes/use-add-make";
import { useEditMake } from "@/api-hooks/vehicles/makes/use-edit-make";

function AddEditMakeModal({
  make,
  triggerModalId,
  modalTitle,
  setMake,
}: {
  make?: VehicleMakeType;
  triggerModalId: string;
  modalTitle: string;
  setMake?: React.Dispatch<React.SetStateAction<VehicleMakeType | undefined>>;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: addMake, isPending: isAdding } = useAddMake({
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editMake, isPending: isEditing } = useEditMake({
    makeId: make?._id!,
    callBackOnSuccess: () => {
      reset();
      setMake && setMake(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.MakeSchema),
    defaultValues: {
      name: make?.name || "",
    },
  });

  const onSubmit = (data: MakeSchemaType) => {
    if (make) editMake(data);
    else addMake(data);
  };

  useEffect(() => {
    if (make) {
      reset({
        name: make?.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [make]);

  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setMake && setMake(undefined);
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

export default AddEditMakeModal;
