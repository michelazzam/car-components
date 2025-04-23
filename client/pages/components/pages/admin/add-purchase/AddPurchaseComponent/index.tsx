import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TotalsCard from "./TotalsCard";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import { AddPurchaseSchemaType, apiValidations } from "@/lib/apiValidations";
import { useEditPurchase } from "@/api-hooks/purchase/use-edit-purchase";
import { useAddPurchase } from "@/api-hooks/purchase/use-add-purchase";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import ExpenseModal from "../../expenses/ExpenseModal";

const CustomAddPurchaseComponent = () => {
  //----------------------------------STATES--------------------------------------

  //----------------------------------STORE--------------------------------------
  const {
    products: productsStore,
    clearPurchase,
    invoiceDetails: { supplier },
    payment: expense,
    editingPurchase,
    totals,
    addPayment: addExpense,
  } = usePurchase();
  //--------------------------------------------------------------

  //----------------------------------API CALLS-------------------------------------

  //---PURCHASE MUTATION---
  const { mutate: addPurchase, isPending: isPendingAddPurchase } =
    useAddPurchase({
      callBackOnSuccess: () => {
        handleSuccess();
      },
    });
  const { mutate: editPurchase, isPending: isPendingEditPurchase } =
    useEditPurchase({
      id: editingPurchase?._id || "",
      callBackOnSuccess: () => {
        handleSuccess();
      },
    });
  //----------------------------------REFS------------------------------------------

  const addPurchaseCancelRef = useRef(null);
  const addPurchaseFormRef = useRef<HTMLFormElement | null>(null);

  //----------------------------------FORM SETUP------------------------------------

  const methods = useForm<AddPurchaseSchemaType>({
    resolver: zodResolver(apiValidations.AddPurchaseSchema),
    defaultValues: {
      amountPaid: 0,
      vatLBP: 0,
      vatPercent: 0,
      supplierId: supplier?.value,
      invoiceNumber: editingPurchase?.invoiceNumber || "",
      invoiceDate: editingPurchase?.invoiceDate || "",
      customerConsultant: editingPurchase?.customerConsultant || "",
      phoneNumber: editingPurchase?.phoneNumber?.split("-")[1] || "",
    },
  });
  const { handleSubmit, reset } = methods;

  //----------------------------------CONSTANTS------------------------------------
  //----------------------------------HANDLERS & Functions----------------------------
  const handleSuccess = () => {
    reset();
    clearPurchase();
  };
  useEffect(() => {
    console.log(totals.totalAmountPaid);
  }, [totals]);
  const onSubmitAddEdit = (data: AddPurchaseSchemaType) => {
    const newData = {
      ...data,
      items: productsStore.map((product) => ({
        ...product,
        productId: product.itemId,
      })),

      amountPaid: totals.totalAmountPaid,
      notes: expense.note,
      totalAmount: totals.totalAmount,
    };

    if (editingPurchase) {
      editPurchase({
        ...newData,
      });
    } else {
      addPurchase({
        ...newData,
      });
    }
  };

  const onError = (errors = {}) => {
    console.log("error", errors);
  };

  return (
    <>
      {/*Add Purchase */}
      <div>
        <FormProvider {...methods}>
          <form
            ref={addPurchaseFormRef}
            onSubmit={handleSubmit(onSubmitAddEdit, onError)}
          >
            <div className="grid grid-cols-12 mb-4">
              <div className="col-span-6">
                <InvoiceDetailsForm />
              </div>
              <div className="col-span-6">
                <TotalsCard />
              </div>
            </div>
          </form>
        </FormProvider>

        <div className="border p-4 shadow-sm" style={{ borderRadius: "8px" }}>
          <AddItemForm />
          <div className="flex flex-col gap-3 divider">
            {productsStore.map((product) => (
              <ItemRow product={product} />
            ))}
          </div>
        </div>

        <div className=" my-4 flex justify-end px-5">
          <button
            type="button"
            className="btn btn-cancel me-2"
            ref={addPurchaseCancelRef}
          >
            Cancel
          </button>
          <button
            disabled={
              productsStore.length === 0 ||
              isPendingAddPurchase ||
              isPendingEditPurchase
            }
            onClick={() =>
              addPurchaseFormRef?.current &&
              addPurchaseFormRef?.current.requestSubmit()
            }
            type="submit"
            className="ti-btn ti-btn-primary-full disabled:bg-gray-500"
          >
            {editingPurchase ? "Save Changes" : "Add Purchase"}
          </button>
        </div>
        <ExpenseModal
          triggerModalId="add-expense-from-purchase-modal"
          modalTitle="Add Expense"
          onSuccess={({ amount, note }) => {
            addExpense({
              amount: amount,
              amountLbp: 0,
              note: note,
            });
          }}
        />
      </div>
      {/* Add Purchase */}
    </>
  );
};

export default CustomAddPurchaseComponent;
