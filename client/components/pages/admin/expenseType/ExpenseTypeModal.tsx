import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import { ExpenseType } from "@/api-hooks/expensesType/use-list-expensesType";
import { useAddExpenseType } from "@/api-hooks/expensesType/use-add-expenseType";
import { useEditExpenseType } from "@/api-hooks/expensesType/use-edit-expenseType";

function ExpenseTypeModal({
  expenseType,
  triggerModalId,
  modalTitle,
  setSelectedExpenseType,
}: {
  expenseType?: ExpenseType;
  triggerModalId: string;
  modalTitle: string;
  setSelectedExpenseType: (expense: ExpenseType | undefined) => void;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.AddExpenseType),
    defaultValues: {
      name: "",
    },
  });

  //---------------------------API----------------------------------
  const { mutate: addExpenseType, isPending: isAdding } = useAddExpenseType({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
    },
  });

  const { mutate: editExpenseType, isPending: isEditing } = useEditExpenseType({
    id: expenseType?._id!,
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
      setSelectedExpenseType(undefined);
    },
  });

  const onSubmit = (data: { name: string }) => {
    if (expenseType) editExpenseType(data);
    else addExpenseType(data);
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (expenseType) {
      // Reset the form with existing expense data
      reset({
        name: expenseType.name,
      });
    } else {
      // Reset the form to default values if there's no expense (e.g., for creating a new expense)
      reset({
        name: "",
      });
    }
  }, [expenseType]);

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setSelectedExpenseType(undefined);
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
            name="name"
            label="Name"
            placeholder="name.."
            colSpan={12}
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

export default ExpenseTypeModal;
