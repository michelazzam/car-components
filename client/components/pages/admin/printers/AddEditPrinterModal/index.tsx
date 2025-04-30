import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, PrinterSchema } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { useAddPrinter } from "@/api-hooks/printers/use-add-printer";
import { Printer } from "@/api-hooks/printers/use-list-printers";
import { useEditPrinter } from "@/api-hooks/printers/use-edit-printer";

function AddEditPrinterModal({
  triggerModalId,
  printer,
}: {
  triggerModalId: string;
  printer?: Printer;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: addProduct, isPending: isAdding } = useAddPrinter({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });

  const { mutate: editProduct, isPending: isEditing } = useEditPrinter({
    id: printer?._id!,
    callBackOnSuccess: () => {
      cancelFormRef.current?.click();
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm<PrinterSchema>({
    resolver: zodResolver(apiValidations.AddEditPrinter),
    defaultValues: {
      name: printer?.name || "",
      ipAddress: printer?.ipAddress || "",
    },
  });

  const onFormSubmit = (data: PrinterSchema) => {
    if (printer) editProduct(data);
    else addProduct(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized with the printer object, so we need to reset the form state
  useEffect(() => {
    if (printer) {
      reset({
        name: printer.name,
        ipAddress: printer.ipAddress,
      });
    }
  }, [printer]);

  return (
    <Modal id={triggerModalId} size="md">
      <Modal.Header title="Add Item" id={triggerModalId} />
      <Modal.Body>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-12 gap-x-2"
        >
          <TextFieldControlled
            control={control}
            name="name"
            label="Name"
            colSpan={6}
          />
          <TextFieldControlled
            control={control}
            name="ipAddress"
            label="IP Address"
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
          disabled={isAdding}
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

export default AddEditPrinterModal;
