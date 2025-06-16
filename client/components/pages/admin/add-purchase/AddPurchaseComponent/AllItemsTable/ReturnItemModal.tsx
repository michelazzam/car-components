import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddPurchaseItemSchemaType,
  apiValidations,
  ReturnItemSchemaType,
} from "@/lib/apiValidations";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";

function ReturnItemModal({
  returnItem,
  triggerModalId,
  modalTitle,
  setReturnItem,
}: {
  returnItem: AddPurchaseItemSchemaType | null;
  triggerModalId: string;
  modalTitle: string;
  setReturnItem: React.Dispatch<
    React.SetStateAction<AddPurchaseItemSchemaType | null>
  >;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------STORE------------------------------
  const { editQuantityReturned } = usePurchaseFormStore();
  //---------------------------API----------------------------------

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.ReturnItemSchema),
    defaultValues: {
      quantityReturned: returnItem?.quantityReturned || 0,
    },
  });

  const onSubmit = (data: ReturnItemSchemaType) => {
    console.log("data", returnItem?.itemId);
    editQuantityReturned(returnItem?.itemId!, data.quantityReturned!);
    setReturnItem(null);
    cancelFormRef.current?.click();
  };

  useEffect(() => {
    if (returnItem) {
      reset({
        quantityReturned: returnItem?.quantityReturned || 0,
      });
    } else {
      reset({
        quantityReturned: 0,
      });
    }
  }, [returnItem]);

  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="xs"
      onClose={() => {
        setReturnItem(null);
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
          <div className="col-span-12 bg-info/10 px-4 py-2 rounded-md mb-2">
            <p className="text-info">
              You are returning quantity of {returnItem?.name}.
            </p>
          </div>
          <NumberFieldControlled
            control={control}
            name="quantityReturned"
            label="Quantity Returned"
            placeholder="Quantity Returned"
            colSpan={12}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          disabled={false}
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#${triggerModalId}`}
        >
          Cancel
        </button>
        <button
          disabled={false}
          type="button"
          onClick={() => {
            console.log("clicked");
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {"Submit"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReturnItemModal;
