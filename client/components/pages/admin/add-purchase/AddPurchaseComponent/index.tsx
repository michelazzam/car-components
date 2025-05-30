import React, { useEffect, useRef } from "react";
import TotalsCard from "./TotalsCard";
import AddItemForm from "./AddItemForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import { useEditPurchase } from "@/api-hooks/purchase/use-edit-purchase";
import { useAddPurchase } from "@/api-hooks/purchase/use-add-purchase";
import { usePurchaseFormStore } from "@/shared/store/usePurchaseStore";
import ExpenseModal from "../../expenses/ExpenseModal";
import { useRouter } from "next/router";
import AllItemsTable from "./AllItemsTable";
import AddEditSupplierModal from "../../supplier/AddEditSupplierModal";
import toast from "react-hot-toast";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";

const CustomAddPurchaseComponent = () => {
  //----------------------------------STORE--------------------------------------
  const {
    formValues,
    editingPurchase,
    setFieldValue,
    setEditingPurchase,
    reset,
    isFormValid,
    populatePurchase,
  } = usePurchaseFormStore();
  const { items } = formValues;
  const { data: usdRateData } = useGetUsdRate();
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

  //----------------------------------FORM SETUP------------------------------------
  useEffect(() => {
    if (editingPurchase) {
      // here, we should populate all values in the store with the editing purchase values
      populatePurchase(editingPurchase, usdRateData?.usdRate);
    }
  }, [editingPurchase]);

  //----------------------------------CONSTANTS------------------------------------
  //----------------------------------HANDLERS & Functions----------------------------
  const router = useRouter();
  const handleSuccess = () => {
    reset();
    setEditingPurchase(undefined);
    router.push("/admin/purchase");
  };

  const handleSubmit = () => {
    // validate form
    const { errors } = isFormValid();
    if (errors.length > 0) {
      toast.error("Please fix the following errors", {
        position: "top-center",
      });
      return;
    }
    const data = {
      ...formValues,
      items: formValues.items.map((item) => ({
        ...item,
        productId: item.itemId,
      })),
      paymentAmount: undefined,
      totalPaid: undefined,
      totalWithTax: undefined,
      tvaPercent: undefined,
      supplier: undefined,
      usdRate: undefined,

      amountPaid: formValues.totalPaid,
      totalAmount: formValues.totalWithTax,
      subTotal: formValues.subTotal,
      vatPercent: formValues.tvaPercent,
      vatLBP: formValues.vatLBP,
      supplierId: formValues.supplier?.value || "",
      customerConsultant: formValues.customerConsultant,
    };

    if (editingPurchase) {
      editPurchase({
        ...data,
      });
    } else {
      addPurchase({
        ...data,
      });
    }
  };

  return (
    <>
      {/*Add Purchase */}
      <div className="mb-[1.5rem]">
        <div className="grid grid-cols-6 lg:grid-cols-12 mb-4 gap-x-4">
          <div className="col-span-6 bg-gray-100 rounded-lg">
            <InvoiceDetailsForm />
          </div>
          <div className="col-span-6 bg-gray-100 rounded-lg">
            <TotalsCard />
          </div>
        </div>

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
              reset();

              router.push("/admin/purchase");
            }}
          >
            Cancel
          </button>
          <button
            disabled={
              items.length === 0 ||
              isPendingAddPurchase ||
              isPendingEditPurchase
            }
            onClick={() => handleSubmit()}
            type="submit"
            className="ti-btn ti-btn-primary-full disabled:bg-gray-500"
          >
            {editingPurchase ? "Save Changes" : "Add Purchase"}
          </button>
        </div>
        <ExpenseModal
          triggerModalId="add-expense-from-purchase-modal"
          modalTitle="Add Expense"
          onSuccess={({ amount }) => {
            setFieldValue("paymentAmount", amount);
          }}
        />
        <AddEditSupplierModal triggerModalId="add-supplier-modal" />
      </div>
      {/* Add Purchase */}
    </>
  );
};

export default CustomAddPurchaseComponent;
