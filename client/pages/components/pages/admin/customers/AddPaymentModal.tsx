import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPaymentSchema, apiValidations } from "@/lib/apiValidations";
import { useAddPayment } from "@/api-hooks/customer/use-add-payment";
import NumberField from "@/pages/components/admin/FormFields/NumberField";
import { Invoice } from "@/api-hooks/invoices/useListInvoices";

function AddPaymentModal({
  triggerModalId,
  modalTitle,
  selectedInvoice,
}: {
  triggerModalId: string;
  modalTitle: string;
  selectedInvoice?: Invoice;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------

  const { mutate: addPayment, isPending: isAdding } = useAddPayment({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
    invoiceId: selectedInvoice?._id!,
  });

  //---------------------------FORM---------------------------------
  type AddPaymentFormErrors = FieldErrors<AddPaymentSchema> & {
    payment?: {
      message?: string;
    };
  };
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddPaymentSchema, AddPaymentFormErrors>({
    resolver: zodResolver(apiValidations.AddPaymentSchema),
    defaultValues: {
      amountPaidUsd: 0,
      amountPaidLbp: 0,
    },
  });

  const onSubmit = (data: AddPaymentSchema) => {
    if (selectedInvoice) {
      addPayment(data);
    } else {
    }
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    reset({
      amountPaidUsd: 0,
      amountPaidLbp: 0,
    });
  }, [selectedInvoice]);

  // when pressing enter in the input field, we need to add the ingredient
  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
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
          <NumberField
            control={control}
            name="amountPaidUsd"
            label="Amount Paid in USD"
            placeholder="amount paid in USD"
            colSpan={6}
            prefix="$"
          />
          <NumberField
            control={control}
            name="amountPaidLbp"
            label="Amount Paid in LBP"
            placeholder="amount paid in LBP"
            colSpan={6}
            prefix="L.L."
          />
          {/* Displaying refine error */}

          <div className="h-4 col-span-12">
            {
              //@ts-ignore
              errors.payment && (
                //@ts-ignore
                <div className="text-red">{errors.payment.message}</div>
              )
            }
          </div>
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
          disabled={false}
          type="submit"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {isAdding ? "Submitting..." : "Submit"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddPaymentModal;
