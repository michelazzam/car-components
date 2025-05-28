import { useFieldArray, useFormContext } from "react-hook-form";
import { useListPaymentMethods } from "@/api-hooks/payment-methods/use-list-payment-method";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import Modal from "@/shared/Modal";
import React from "react";
import { AddInvoiceSchema } from "@/lib/apiValidations";
import { FaTrash } from "react-icons/fa6";

function InvoicePaymentMethodModal({
  triggerModalId,
  modalTitle,
}: {
  triggerModalId: string;
  modalTitle: string;
}) {
  const formContext = useFormContext<AddInvoiceSchema>();
  if (!formContext) return <div>Loading...</div>;

  const { control, watch, register } = formContext;
  const { append, remove, fields } = useFieldArray({
    control,
    name: "paymentMethods", // Field name in the form data
  });

  const currentPaymentMethods = watch("paymentMethods");

  const { data: paymentMethods } = useListPaymentMethods({});

  // Handle toggle for checkbox
  const onToggle = (paymentMethodId: string, isSelected: boolean) => {
    const selectedPaymentMethod = paymentMethods?.find(
      (pm) => pm._id === paymentMethodId
    );

    if (isSelected) {
      // Add to form
      append({
        id: selectedPaymentMethod?._id || "",
        method: selectedPaymentMethod?.method || "",
        note: "", // Initially empty for new payment method
      });
    } else {
      // Remove from form
      const index = currentPaymentMethods.findIndex(
        (pm) => pm.id === paymentMethodId
      );
      if (index > -1) remove(index);
    }
  };

  return (
    <Modal
      onOpen={() => {}}
      id={triggerModalId}
      size="md"
      onClose={() => {
        console.log("close");
      }}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <div className=" flex flex-wrap gap-x-4">
          {paymentMethods
            ?.filter((paymentMethod) => {
              const isSelected = currentPaymentMethods?.some(
                (pm) =>
                  paymentMethod._id === pm.id ||
                  paymentMethod.method === pm.method
              );
              return !isSelected;
            })
            ?.map((paymentMethod) => {
              // Retrieve the selected state based on form data

              return (
                <div key={paymentMethod._id} className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onToggle(paymentMethod._id, true)}
                    className="ti ti-btn-primary ti-btn"
                  >
                    {paymentMethod.method}
                  </button>
                </div>
              );
            })}
        </div>

        <div key={watch("customerId")} className="grid grid-cols-2 gap-x-4">
          {fields?.map((field, index) => {
            const methodLabel = watch(`paymentMethods.${index}.method`) || "";

            return (
              <div key={field.id} className="flex  gap-2">
                <input
                  type="hidden"
                  {...register(`paymentMethods.${index}.id` as const)}
                />
                <input
                  type="hidden"
                  {...register(`paymentMethods.${index}.method` as const)}
                />

                <TextFieldControlled
                  marginBottom="mb-0"
                  name={`paymentMethods.${index}.note`}
                  label={`${methodLabel} Note`}
                  control={control}
                />
                <button
                  className="ti ti-btn ti-btn-danger mt-5 !mb-0 "
                  onClick={() => remove(index)}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#add-invoice-payment-method-modal`}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default InvoicePaymentMethodModal;
