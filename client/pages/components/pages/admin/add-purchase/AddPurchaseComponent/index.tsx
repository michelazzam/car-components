import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import TotalsCard from "./TotalsCard";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import { AddPurchaseSchemaType, apiValidations } from "@/lib/apiValidations";
import { useEditPurchase } from "@/api-hooks/purchase/use-edit-purchase";
import { useAddPurchase } from "@/api-hooks/purchase/use-add-purchase";
import { usePurchase } from "@/shared/store/usePurchaseStore";

const CustomAddPurchaseComponent = () => {
  //----------------------------------STATES--------------------------------------

  //----------------------------------STORE--------------------------------------
  const {
    products: productsStore,
    clearPurchase,
    invoiceDetails: { supplier },
    setSupplier,
    tva,
    lebaneseTva,
    payment,
    editingPurchase,
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
  console.log(editingPurchase?._id);
  //----------------------------------REFS------------------------------------------

  /** @type {React.MutableRefObject<HTMLButtonElement | null>} */
  const addPurchaseCancelRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLFormElement | null>} */
  const addPurchaseFormRef = useRef<HTMLFormElement | null>(null);

  //----------------------------------FORM SETUP------------------------------------

  const { control, handleSubmit, reset, watch } =
    useForm<AddPurchaseSchemaType>({
      resolver: zodResolver(apiValidations.AddPurchaseSchema),
      defaultValues: {
        supplier: supplier,
        invoiceNumber: editingPurchase?.invoiceNumber || "",
        invoiceDate: editingPurchase?.invoiceDate || "",
        customerConsultant: editingPurchase?.customerConsultant || "",
        phoneNumber: editingPurchase?.phoneNumber?.split("-")[1] || "",
        phoneCode: editingPurchase?.phoneNumber?.split("-")[0] || "",
      },
    });
  //----------------------------------EFFECTS--------------------------------------

  // Watch for supplier changes and update the store
  const watchedSupplier = watch("supplier");
  useEffect(() => {
    if (watchedSupplier) {
      setSupplier(watchedSupplier);
    }
  }, [watchedSupplier, setSupplier]);

  //----------------------------------CONSTANTS------------------------------------
  //----------------------------------HANDLERS & Functions----------------------------
  const handleSuccess = () => {
    reset();
    clearPurchase();
  };

  const onSubmitAddEdit = (data: AddPurchaseSchemaType) => {
    const newData = {
      ...data,
      supplierId: data?.supplier?.value,
      products: productsStore.map((product) => ({
        ...product,
        productId: product.itemId,
      })),
      vatPercent: tva,
      vatLBP: lebaneseTva,
      fromCaisse: payment.fromCaisse,
      fromBalance: payment.fromBalance,
      fromCaisseLbp: payment.fromCaisseLbp,
      notes: payment.notes,
    };

    newData.phoneNumber = `${
      newData.phoneCode
    }-${newData.phoneNumber.replaceAll(` `, ``)}`;

    if (editingPurchase) {
      editPurchase({
        ...newData,
        supplierId: newData?.supplier?.value || "",
      });
    } else {
      addPurchase({
        ...newData,
        supplierId: newData?.supplier?.value || "",
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
        <form
          ref={addPurchaseFormRef}
          onSubmit={handleSubmit(onSubmitAddEdit, onError)}
        >
          <div className=" d-flex mb-4">
            <div className="col-6">
              <InvoiceDetailsForm control={control} />
            </div>
            <div className="col-6">
              <TotalsCard />
            </div>
          </div>
        </form>

        <div className="border p-4 shadow-sm" style={{ borderRadius: "8px" }}>
          <AddItemForm />
          <div className="d-flex flex-column gap-3 divider">
            {productsStore.map((product) => (
              <ItemRow product={product} />
            ))}
          </div>
        </div>

        <div className=" my-4  d-flex justify-content-end px-5">
          <button
            type="button"
            className="btn btn-cancel me-2"
            // data-bs-dismiss="modal"
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
            className="btn btn-submit"
          >
            {editingPurchase ? "Save Changes" : "Add Purchase"}
          </button>
        </div>
      </div>
      {/* Add Purchase */}
    </>
  );
};

export default CustomAddPurchaseComponent;
