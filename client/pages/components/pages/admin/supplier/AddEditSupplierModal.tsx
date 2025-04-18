import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, SupplierSchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";

import { Supplier } from "@/api-hooks/supplier/use-list-supplier";

function AddEditSupplierModal({
  triggerModalId,
  supplier,
}: {
  triggerModalId: string;
  supplier?: Supplier;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  //   const { mutate: addSupplier, isPending: isAdding } = useAddSupplier({
  //     callBackOnSuccess: () => {
  //       reset();
  //       cancelFormRef.current?.click();
  //     },
  //   });

  //   const { mutate: editSupplier, isPending: isEditing } = useEditSupplier({
  //     id: Supplier?._id!,
  //     callBackOnSuccess: () => {
  //       cancelFormRef.current?.click();
  //     },
  //   });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm<SupplierSchema>({
    resolver: zodResolver(apiValidations.AddEditSupplier),
    defaultValues: {
      name: supplier?.name || "",
      phoneNumber: supplier?.phoneNumber || "",
      address: supplier?.address || "",
      loans: supplier?.loans || 0,
    },
  });

  const onFormSubmit = (data: SupplierSchema) => {
    // if (supplier) editSupplier(data);
    // else addSupplier(data);
    console.log(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized with the printer object, so we need to reset the form state
  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
      });
    }
  }, [supplier]);

  return (
    <Modal id={triggerModalId} size="xs">
      <Modal.Header title="Add Item" id={triggerModalId} />
      <Modal.Body>
        <form ref={formRef} onSubmit={handleSubmit(onFormSubmit)}>
          <TextFieldControlled
            control={control}
            name="name"
            label="Name"
            colSpan={6}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Cancel
        </button>
        <button
          //   disabled={isAdding}
          type="submit"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {/* {isAdding || isEditing ? "Submitting..." : "Submit"} */}
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEditSupplierModal;
