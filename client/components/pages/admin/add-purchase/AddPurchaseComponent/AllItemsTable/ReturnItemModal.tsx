import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddPurchaseItemSchemaType,
  apiValidations,
  ReturnItemSchemaType,
} from "@/lib/apiValidations";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import DateFieldControlled from "@/components/admin/FormControlledFields/DateFieldControlled";
import { FaTrash } from "react-icons/fa";

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
  const { editReturnedItems } = usePurchaseFormStore();
  //---------------------------API----------------------------------

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.ReturnItemsFormSchema),
    defaultValues: {
      returns: returnItem?.returns || [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "returns",
  });
  const onSubmit = (data: { returns: ReturnItemSchemaType[] }) => {
    console.log("data", returnItem?.itemId);
    editReturnedItems(returnItem?.itemId!, data.returns);
    setReturnItem(null);
    reset();
    cancelFormRef.current?.click();
  };

  useEffect(() => {
    if (returnItem) {
      reset({
        returns: returnItem?.returns || [],
      });
    } else {
      reset({
        returns: [],
      });
    }
  }, [returnItem]);

  const onInvalid = (errors: any) => console.error(errors);
  return (
    <Modal
      id={triggerModalId}
      size="lg"
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
          {fields.length > 0 && (
            <div className="col-span-12 grid grid-cols-12 gap-x-2">
              <p className="col-span-5">Quantity Returned: </p>
              <p className="col-span-5">Returned At: </p>
            </div>
          )}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="col-span-12 grid grid-cols-12 gap-x-2"
            >
              <NumberFieldControlled
                control={control}
                name={`returns.${index}.quantityReturned`}
                placeholder="Quantity Returned"
                colSpan={5}
              />
              <DateFieldControlled
                formatType="dd-MM-yyyy"
                control={control}
                name={`returns.${index}.returnedAt`}
                placeholder="Returned At"
                colSpan={5}
              />
              <button
                type="button"
                className="ti-btn ti-btn-danger col-span-2 !mb-5"
                onClick={() => remove(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="ti-btn ti-btn-primary col-span-12 mt-2"
            onClick={() => append({ quantityReturned: 0, returnedAt: "" })}
          >
            Add Return
          </button>
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
