import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, SupplierSchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";

import { Supplier } from "@/api-hooks/supplier/use-list-supplier";
import { useAddSupplier } from "@/api-hooks/supplier/use-Add-supplier";
import { useEditSupplier } from "@/api-hooks/supplier/use-edit-supplier";

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
  const { mutate: addSupplier, isPending: isAdding } = useAddSupplier({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });

  const { mutate: editSupplier, isPending: isEditing } = useEditSupplier({
    id: supplier?._id!,
    callBackOnSuccess: () => {
      cancelFormRef.current?.click();
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm<SupplierSchema>({
    resolver: zodResolver(apiValidations.AddEditSupplier),
    defaultValues: {
      name: "",
      capital: "",
      poBox: "",
      address: "",
      phoneNumber: "",
      fax: "",
      ext: "",
      email: "",
      website: "",
      vatNumber: "",
      extraInfo: "",
    },
  });

  const onFormSubmit = (data: SupplierSchema) => {
    if (supplier) editSupplier(data);
    else addSupplier(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized with the printer object, so we need to reset the form state
  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier?.name,
        capital: supplier?.capital,
        poBox: supplier?.poBox,
        address: supplier?.address,
        phoneNumber: supplier?.phoneNumber,
        fax: supplier?.fax,
        ext: supplier?.ext,
        email: supplier?.email,
        website: supplier?.website,
        vatNumber: supplier?.vatNumber,
        extraInfo: supplier?.extraInfo,
      });
    } else {
      reset({
        name: "",
        capital: "",
        poBox: "",
        address: "",
        phoneNumber: "",
        fax: "",
        ext: "",
        email: "",
        website: "",
        vatNumber: "",
        extraInfo: "",
      });
    }
  }, [supplier]);

  return (
    <Modal id={triggerModalId} size="md">
      <Modal.Header title="Add Item" id={triggerModalId} />
      <Modal.Body>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-12 gap-x-4"
        >
          <TextFieldControlled
            control={control}
            name="name"
            label="Name"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="capital"
            label="Capital"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="poBox"
            label="PO Box"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="address"
            label="Address"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="phoneNumber"
            label="Phone Number"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="fax"
            label="Fax"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="ext"
            label="Ext"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="email"
            label="Email"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="website"
            label="Website"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="vatNumber"
            label="VAT Number"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="extraInfo"
            label="Extra Info"
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
          disabled={isAdding || isEditing}
          type="submit"
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

export default AddEditSupplierModal;
