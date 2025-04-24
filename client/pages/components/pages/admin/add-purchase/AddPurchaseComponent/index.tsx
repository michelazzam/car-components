import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TotalsCard from "./TotalsCard";
import AddItemForm from "./AddItemForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import { AddPurchaseSchemaType, apiValidations } from "@/lib/apiValidations";
import { useEditPurchase } from "@/api-hooks/purchase/use-edit-purchase";
import { useAddPurchase } from "@/api-hooks/purchase/use-add-purchase";
import { usePurchase } from "@/shared/store/usePurchaseStore";
import ExpenseModal from "../../expenses/ExpenseModal";
import { useRouter } from "next/router";
import AllItemsTable from "./AllItemsTable";

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
    setEditingPurchase,
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
      amountPaid: editingPurchase?.amountPaid || 0,
      vatLBP: editingPurchase?.vatLBP || 0,
      vatPercent: editingPurchase?.vatPercent || 0,
      supplierId: supplier?.value,
      invoiceNumber: editingPurchase?.invoiceNumber || "",
      invoiceDate: editingPurchase?.invoiceDate || "",
      customerConsultant: editingPurchase?.customerConsultant || "",
      phoneNumber: editingPurchase?.phoneNumber || "",
    },
  });
  const { handleSubmit, reset } = methods;

  //----------------------------------CONSTANTS------------------------------------
  //----------------------------------HANDLERS & Functions----------------------------
  const router = useRouter();
  const handleSuccess = () => {
    reset();
    clearPurchase();
    setEditingPurchase(undefined);
    router.push("/admin/purchase");
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
      <div className=" my-[1.5rem]">
        <FormProvider {...methods}>
          <form
            ref={addPurchaseFormRef}
            onSubmit={handleSubmit(onSubmitAddEdit, onError)}
          >
            <div className="grid grid-cols-12 mb-4 gap-x-4">
              <div className="col-span-6 bg-gray-100 rounded-lg">
                <InvoiceDetailsForm />
              </div>
              <div className="col-span-6 bg-gray-100 rounded-lg">
                <TotalsCard />
              </div>
            </div>
          </form>
        </FormProvider>

        <div>
          <div className="bg-gray-100 rounded-lg p-2">
            <AddItemForm />
          </div>
          <AllItemsTable />
        </div>

        <div className=" my-4 flex justify-end px-5">
          <button
            type="button"
            className="ti-btn ti-btn-danger me-2"
            ref={addPurchaseCancelRef}
            onClick={() => {
              setEditingPurchase(undefined);
              clearPurchase();
              reset();
              router.push("/admin/purchase");
            }}
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
