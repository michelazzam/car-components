import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, ServiceSchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import { Service } from "@/api-hooks/services/use-list-services";
import { useAddService } from "@/api-hooks/services/use-add-service";
import { useEditService } from "@/api-hooks/services/use-edit-service";

function AddEditServiceModal({
  service,
  triggerModalId,
  modalTitle,
  setService,
}: {
  service?: Service;
  triggerModalId: string;
  modalTitle: string;
  setService?: React.Dispatch<React.SetStateAction<Service | undefined>>;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: addService, isPending: isAdding } = useAddService({
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  const { mutate: editService, isPending: isEditing } = useEditService({
    id: service?._id!,
    callBackOnSuccess: () => {
      reset();
      setService && setService(undefined);
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 10);
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.AddEditService),
    defaultValues: {
      name: service?.name || "",
      price: service?.price || 0,
    },
  });

  const onSubmit = (data: ServiceSchema) => {
    if (service) editService(data);
    else addService(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (service) {
      reset({
        name: service?.name,
        price: service?.price,
      });
    } else {
      reset({
        name: "",
        price: 0,
      });
    }
  }, [service]);

  // when pressing enter in the input field, we need to add the ingredient
  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setService && setService(undefined);
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
          <NumberFieldControlled
            control={control}
            name="price"
            label="Price"
            prefix="$"
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

export default AddEditServiceModal;
