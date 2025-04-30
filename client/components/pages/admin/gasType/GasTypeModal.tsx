import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { ExpenseType } from "@/api-hooks/expensesType/use-list-expensesType";
import { GasType } from "@/api-hooks/gasType/use-list-gasTypes";
import { useAddGasType } from "@/api-hooks/gasType/use-add-gasType";
import { useEditGasType } from "@/api-hooks/gasType/use-edit-gasType";

function GasTypeModal({
  gasType,
  triggerModalId,
  modalTitle,
  setSelectedGasType,
}: {
  gasType?: GasType;
  triggerModalId: string;
  modalTitle: string;
  setSelectedGasType: (expense: ExpenseType | undefined) => void;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.AddExpenseType),
    defaultValues: {
      title: "",
    },
  });

  //---------------------------API----------------------------------
  const { mutate: addGasType, isPending: isAdding } = useAddGasType({
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 1000);
    },
  });

  const { mutate: editGasType, isPending: isEditing } = useEditGasType({
    id: gasType?._id!,
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
        setSelectedGasType(undefined);
      }, 1000);
    },
  });

  const onSubmit = (data: { title: string }) => {
    if (gasType) editGasType(data);
    else addGasType(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (gasType) {
      // Reset the form with existing expense data
      reset({
        title: gasType.title,
      });
    } else {
      // Reset the form to default values if there's no expense (e.g., for creating a new expense)
      reset({
        title: "",
      });
    }
  }, [gasType]);

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setSelectedGasType(undefined);
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
            name="title"
            label="Title"
            placeholder="title.."
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

export default GasTypeModal;
