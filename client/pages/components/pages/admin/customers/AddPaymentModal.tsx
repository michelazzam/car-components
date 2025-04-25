import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPaymentSchema, apiValidations } from "@/lib/apiValidations";
import { useAddPayment } from "@/api-hooks/customer/use-add-payment";
import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";
import { Customer } from "@/api-hooks/customer/use-list-customer";

function AddPaymentModal({
  triggerModalId,
  modalTitle,
  selectedCustomer,
}: {
  triggerModalId: string;
  modalTitle: string;
  selectedCustomer?: Customer;
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
    setValue,
    formState: { errors },
  } = useForm<AddPaymentSchema, AddPaymentFormErrors>({
    resolver: zodResolver(apiValidations.AddPaymentSchema),
    defaultValues: {
      customerId: "",
      amount: 0,
    },
  });

  const onSubmit = (data: AddPaymentSchema) => {
    if (selectedCustomer) {
      addPayment(data);
    } else {
      console.log("there is no data")
    }
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (selectedCustomer) {
      setValue("customerId", selectedCustomer._id || "");
    }
  }, [selectedCustomer]);

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
          <NumberFieldControlled
            control={control}
            name="amount"
            label="Amount Paid in USD"
            placeholder="amount paid in USD"
            colSpan={6}
            prefix="$"
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
          // disabled={false}
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
