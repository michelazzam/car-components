import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, PaymentMethodSchemaType } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { PaymentMethod } from "@/api-hooks/payment-methods/use-list-payment-method";
import { useEditPaymentMethod } from "@/api-hooks/payment-methods/use-edit-payment-method";
import { useAddPaymentMethod } from "@/api-hooks/payment-methods/use-add-payment-method";

function AddEditPaymentMethodModal({
  paymentMethod,
  triggerModalId,
  modalTitle,
  setpaymentMethod,
}: {
  paymentMethod?: PaymentMethod;
  triggerModalId: string;
  modalTitle: string;
  setpaymentMethod?: React.Dispatch<
    React.SetStateAction<PaymentMethod | undefined>
  >;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------

  const { mutate: addPaymentMethod, isPending: isAdding } = useAddPaymentMethod(
    {
      callBackOnSuccess: () => {
        reset();
        setpaymentMethod && setpaymentMethod(undefined);
        setTimeout(() => {
          cancelFormRef.current?.click();
        }, 10);
      },
    }
  );

  const { mutate: editPaymentMethod, isPending: isEditing } =
    useEditPaymentMethod({
      id: paymentMethod?._id!,
      callBackOnSuccess: () => {
        reset();
        setpaymentMethod && setpaymentMethod(undefined);
        setTimeout(() => {
          cancelFormRef.current?.click();
        }, 10);
      },
    });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm<PaymentMethodSchemaType>({
    resolver: zodResolver(apiValidations.PaymentMethodSchema),
    defaultValues: {
      method: paymentMethod?.method || "",
    },
  });

  const onSubmit = (data: PaymentMethodSchemaType) => {
    if (paymentMethod) editPaymentMethod(data);
    else addPaymentMethod(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (paymentMethod) {
      reset({
        method: paymentMethod?.method,
      });
    } else {
      reset({
        method: "",
      });
    }
  }, [paymentMethod]);

  // when pressing enter in the input field, we need to add the ingredient
  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="xs"
      onClose={() => {
        setpaymentMethod && setpaymentMethod(undefined);
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
            name="method"
            label="Method Name"
            placeholder="method name"
            colSpan={12}
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

export default AddEditPaymentMethodModal;
