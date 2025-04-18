import Modal from "@/shared/Modal";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "@/lib/apiValidations";
import TextField from "@/pages/components/admin/FormFields/TextField";
import SelectField from "@/pages/components/admin/FormFields/SelectField";
import { Expense } from "@/api-hooks/expenses/use_list_expenses";
import {
  AddEditExpenseBodyParam,
  useAddExpense,
} from "@/api-hooks/expenses/use_add_expense";
import { useEditExpense } from "@/api-hooks/expenses/use_edit_expense";
import {
  ExpenseType,
  useListExpensesType,
} from "@/api-hooks/expensesType/use-list-expensesType";
import { useAddExpenseType } from "@/api-hooks/expensesType/use-add-expenseType";
import DateField from "@/pages/components/admin/FormFields/DateField";
import NumberField from "@/pages/components/admin/FormFields/NumberField";
import Checkbox from "@/pages/components/admin/ControlledFields/Checkbox";

function ExpenseModal({
  expense,
  triggerModalId,
  modalTitle,
  setSelectedExpense,
}: {
  expense?: Expense;
  triggerModalId: string;
  modalTitle: string;
  setSelectedExpense: (expense: Expense | undefined) => void;
}) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------STATE--------------------------
  const [keepAdding, setKeepAdding] = useState(false);
  //-----------------------------------Options----------------

  const { data: expenseType } = useListExpensesType();
  const expenseTypeOptions = expenseType?.map((exp) => {
    return {
      label: exp?.name,
      value: exp?._id,
    };
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: zodResolver(apiValidations.AddExpense),
    defaultValues: {
      expenseTypeId: "",
      amount: 0,
      date: "",
      note: "",
    },
  });

  //---------------------------API----------------------------------
  const { mutate: addExpense, isPending: isAdding } = useAddExpense({
    callBackOnSuccess: () => {
      reset();
      if (!keepAdding) {
        cancelFormRef.current?.click();
      }
    },
  });

  const mutation = useAddExpenseType({
    callBackOnSuccess: (resp: ExpenseType) => {
      setValue("expenseTypeId", resp._id);
    },
  });

  const { mutate: editExpense, isPending: isEditing } = useEditExpense({
    id: expense?._id!,
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click();
      setSelectedExpense(undefined);
    },
  });

  const onSubmit: SubmitHandler<AddEditExpenseBodyParam> = (
    data: AddEditExpenseBodyParam
  ) => {
    if (expense) editExpense(data);
    else addExpense(data);
  };

  const handleCreateOption = (data: string) => {
    mutation.mutate({
      name: data,
    });
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (expense) {
      // Reset the form with existing expense data
      reset({
        expenseTypeId: expense?.expenseType?._id || "",
        amount: expense?.amount || 0,
        date: expense?.date || "",
        note: expense?.note || "",
      });
    } else {
      // Reset the form to default values if there's no expense (e.g., for creating a new expense)
      reset({
        expenseTypeId: "",
        amount: 0,
        date: "",
        note: "",
      });
    }
  }, [expense]);

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setSelectedExpense(undefined);
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
          <SelectField
            control={control}
            name="expenseTypeId"
            label="Expense Type"
            options={expenseTypeOptions || []}
            placeholder={"Choose Type"}
            colSpan={6}
            creatable={true}
            handleCreate={handleCreateOption}
          />
          <NumberField
            control={control}
            name="amount"
            label="Total Amount"
            placeholder="0.00"
            prefix="$"
            colSpan={6}
          />
          <DateField
            control={control}
            name="date"
            label="Date"
            placeholder="2012-12-01"
            formatType="dd-MM-yyyy"
            colSpan={6}
          />
          <TextField
            control={control}
            name="note"
            dontCapitalize
            label="Note"
            placeholder="note here for later"
            colSpan={6}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        {!expense && (
          <Checkbox
            isChecked={keepAdding}
            onValueChange={(v) => setKeepAdding(v)}
            label="Add More"
          />
        )}
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

export default ExpenseModal;
