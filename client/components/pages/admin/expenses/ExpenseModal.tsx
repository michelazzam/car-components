import Modal from "@/shared/Modal";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, ExpenseSchemaType } from "@/lib/apiValidations";
import TextFieldControlled from "@/components/admin/FormControlledFields/TextFieldControlled";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import { Expense } from "@/api-hooks/expenses/use_list_expenses";
import { useAddExpense } from "@/api-hooks/expenses/use_add_expense";
import { useEditExpense } from "@/api-hooks/expenses/use_edit_expense";
import {
  ExpenseType,
  useListExpensesType,
} from "@/api-hooks/expensesType/use-list-expensesType";
import { useAddExpenseType } from "@/api-hooks/expensesType/use-add-expenseType";
import DateFieldControlled from "@/components/admin/FormControlledFields/DateFieldControlled";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import Checkbox from "@/components/admin/Fields/Checkbox";
import { useListSupplier } from "@/api-hooks/supplier/use-list-supplier";
import { useDebounce } from "@/hooks/useDebounce";
import MultiSelectFieldControlled from "@/components/admin/FormControlledFields/MultiSelectFieldControlled";
import {
  Purchase,
  useListPurchase,
} from "@/api-hooks/purchase/use-list-purchase";

function ExpenseModal({
  expense,
  triggerModalId,
  modalTitle,
  setSelectedExpense,
  onSuccess,
  purchase,
  setPurchase,
}: {
  expense?: Expense;
  triggerModalId: string;
  modalTitle: string;
  setSelectedExpense?: (expense: Expense | undefined) => void;
  onSuccess?: ({ amount, note }: { amount: number; note: string }) => void;
  purchase?: Purchase;
  setPurchase?: React.Dispatch<React.SetStateAction<Purchase | undefined>>;
}) {
  //---------------------------REFS------------------------------
  const expenseFormRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------STATE--------------------------
  const [keepAdding, setKeepAdding] = useState(false);

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset, setValue, watch } =
    useForm<ExpenseSchemaType>({
      resolver: zodResolver(apiValidations.AddExpense),
      defaultValues: {
        expenseTypeId: undefined,
        supplierId: undefined,
        amount: 0,
        date: "",
        note: "",
        purchasesIds: [],
      },
    });

  useEffect(() => {
    if (purchase) {
      setValue("supplierId", purchase.supplier?._id);
      setValue("amount", purchase.totalAmount - purchase.amountPaid);
      console.log("TOTAL AMOUNT IS : ", purchase.totalAmount);
      console.log("AMOUNT PAID IS : ", purchase.amountPaid);
      console.log(
        "DIFFERENCE IS : ",
        purchase.totalAmount - purchase.amountPaid
      );
      setValue("purchasesIds", [
        {
          label: purchase.invoiceNumber,
          value: purchase._id,
        },
      ]);
    }
  }, [purchase]);

  const amount = watch("amount");
  const note = watch("note");
  const supplierId = watch("supplierId") || "";
  //-----------------------------------Options----------------
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const { data: purchases } = useListPurchase({
    pageIndex: 0,
    pageSize: 50,
    search: purchaseSearch,
    supplierId: supplierId,
    enabled: !!supplierId,
  });
  const purchasesOptions = purchases?.purchases?.map((purchase) => ({
    label: purchase.invoiceNumber,
    value: purchase._id,
  }));

  const { data: expenseType } = useListExpensesType();
  const expenseTypeOptions = expenseType?.map((exp) => {
    return {
      label: exp?.name,
      value: exp?._id,
    };
  });

  //---------------------------API----------------------------------
  const [search, setSearch] = useState("");
  const debouncedSupplierSearch = useDebounce(search);
  const { data: suppliersResponse } = useListSupplier({
    pageIndex: 0,
    pageSize: 50,
    search: debouncedSupplierSearch,
  });

  const suppliersOptions = suppliersResponse?.suppliers?.map((supplier) => ({
    label: supplier.name,
    value: supplier._id,
  }));

  const { mutate: addExpense, isPending: isAdding } = useAddExpense({
    callBackOnSuccess: () => {
      onSuccess?.({
        amount: amount,
        note: note || "",
      });
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
      setSelectedExpense?.(undefined);
    },
  });

  const onSubmit: SubmitHandler<ExpenseSchemaType> = (
    data: ExpenseSchemaType
  ) => {
    const refinedData = {
      ...data,
      purchasesIds: data.purchasesIds.map((item) => item.value),
      expenseTypeId:
        data.expenseTypeId && data.expenseTypeId.length > 0
          ? data.expenseTypeId
          : undefined,
      supplierId:
        data.supplierId && data.supplierId.length > 0
          ? data.supplierId
          : undefined,
    };
    if (expense) editExpense(refinedData);
    else addExpense(refinedData);
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
        supplierId: expense?.supplier?._id || "",
        purchasesIds:
          expense?.purchases?.map((purchase) => {
            return {
              label: purchase.invoiceNumber,
              value: purchase._id,
            };
          }) || [],
      });
    } else {
      // Reset the form to default values if there's no expense (e.g., for creating a new expense)
      reset({
        expenseTypeId: "",
        amount: 0,
        date: "",
        note: "",
        supplierId: "",
        purchasesIds: [],
      });
    }
  }, [expense]);

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Modal
      id={triggerModalId}
      size="md"
      onClose={() => {
        setSelectedExpense?.(undefined);
        setPurchase?.(undefined);
        reset();
      }}
    >
      <Modal.Header title={modalTitle} id={triggerModalId} />
      <Modal.Body>
        <form
          ref={expenseFormRef}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-12 gap-x-2 items-center"
        >
          <SelectFieldControlled
            control={control}
            name="expenseTypeId"
            label="Expense Type"
            options={expenseTypeOptions || []}
            placeholder={"Choose Type"}
            colSpan={6}
            creatable={true}
            handleCreate={handleCreateOption}
          />

          <NumberFieldControlled
            control={control}
            name="amount"
            label="Total Amount"
            placeholder="0.00"
            prefix="$"
            colSpan={6}
          />
          <SelectFieldControlled
            control={control}
            disabled={!!purchase}
            name="supplierId"
            label="Supplier"
            options={suppliersOptions || []}
            placeholder={"Choose Supplier"}
            colSpan={6}
            creatable={true}
            handleCreate={handleCreateOption}
            onInputChange={(value) => {
              setSearch(value);
            }}
          />
          <MultiSelectFieldControlled
            onSearchChange={(value) => {
              setPurchaseSearch(value);
            }}
            disabled={!supplierId}
            control={control}
            name="purchasesIds"
            treatAsObject
            label="Purchases"
            options={purchasesOptions || []}
            placeholder={"Choose Purchases"}
            colSpan={6}
          />

          <DateFieldControlled
            control={control}
            name="date"
            label="Date"
            placeholder="2012-12-01"
            formatType="dd-MM-yyyy"
            colSpan={6}
          />
          <TextFieldControlled
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
            expenseFormRef.current?.requestSubmit();
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
