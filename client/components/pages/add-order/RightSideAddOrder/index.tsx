"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemsList from "./ItemsList";
import Checkbox from "@/components/admin/Fields/Checkbox";
import { clearPosStore, usePosStore } from "@/shared/store/usePosStore";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useAddInvoice } from "@/api-hooks/invoices/use-add-invoices";
import GeneralInfoModal from "./GeneralInfoModal";
import { useGetOrganization } from "@/api-hooks/restaurant/use-get-organization-info";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import SelectFieldControlled from "@/components/admin/FormControlledFields/SelectFieldControlled";
import toast from "react-hot-toast";
import { useEditInvoice } from "@/api-hooks/invoices/use-edit-invoices";
import { useRouter } from "next/router";
import PrintInvoiceModal from "../../admin/invoices/PrintInvoiceModal";
import { FaEye, FaPrint } from "react-icons/fa6";
import { AddInvoiceSchema } from "@/lib/apiValidations";
// import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import { customerTypeOption, discountTypeOptions } from "@/constants/constant";
// import { Invoice } from "@/api-hooks/invoices/useListInvoices";

function RightSideAddOrder({
  refetchProducts,
}: {
  refetchProducts: () => void;
}) {
  //--------------------State-------------------------------------
  const [invoice, setInvoice] = useState();
  const [isPrint, setIsPrint] = useState(false);
  const [isFullPaid, setIsFullPaid] = useState(false);
  // const [previewingInvoice, setPreviewingInvoice] = useState<Invoice>();

  //--------------------Refs-------------------------------------
  const printRef = useRef<HTMLFormElement>(null);
  //--------------------Storage-----------------------------------
  const {
    cartSum,
    setEditingInvoice,
    setVatAmount,
    totalAmount,
    applyDiscount,
    discountStore,
    vatAmount,
    editingInvoice,
    // cart,
  } = usePosStore();

  //---------------------Router----------------------------------------
  const router = useRouter();

  //----------------------Form Stroage---------------------------------
  const formContext = useFormContext<AddInvoiceSchema>();
  if (!formContext) return <div>Loading...</div>;

  const { handleSubmit, control, watch, setValue, reset } = formContext;

  const { hasVehicle } = watch();

  //-----------------------API Calls------------------------------------

  const { data: organization } = useGetOrganization();
  // const { data: usdRate } = useGetUsdRate();
  const successFunction = () => {
    refetchProducts();
    clearPosStore();
    setIsFullPaid(false);
    if (editingInvoice) {
      setEditingInvoice(undefined);
      resetForm();
      if (!isPrint) {
        setTimeout(() => {
          router.back();
        }, 1000);
      }
    } else {
      reset();
    }
  };

  const mutation = useAddInvoice({
    callBackOnSuccess: (resp: any) => {
      successFunction();
      setInvoice(resp);
      if (isPrint) {
        printRef.current?.click();
      }
      setIsPrint(false);
    },
  });

  const { mutate: editInvoice, isPending: isEditInvoicePending } =
    useEditInvoice({
      id: editingInvoice?._id || "",
      callBackOnSuccess: (resp: any) => {
        successFunction();
        setInvoice(resp);
        if (isPrint) {
          printRef.current?.click();
        }
        setIsPrint(false);
      },
    });

  //------------------------------Functions-------------------------------------
  const onSubmit: SubmitHandler<AddInvoiceSchema> = (
    data: AddInvoiceSchema
  ) => {
    if (data.items && data.items.length < 1) {
      return toast.error("please add products or services");
    }
    console.log("isFullPaid:", isFullPaid);
    if (isFullPaid || data.paidAmountUsd !== 0 || data.paidAmountUsd !== 0) {
      data.isPaid = true;
    } else {
      data.isPaid = false;
    }
    if (editingInvoice) {
      editInvoice(data);
    } else {
      mutation.mutate(data);
    }
    return;
  };

  //-------------------Effects----------------------------------

  // const setPrevInv = () => {
  //   if (usdRate) {
  //     setPreviewingInvoice({
  //       customerNote: getValues("customerNote"),
  //       invoiceNumber: getValues("invoiceNumber"),
  //       discount: {
  //         amount: discountStore.amount,
  //         type: discountStore.type,
  //       },
  //       totalPriceUsd: totalAmount(),
  //       paidAmountUsd: getValues("paidAmountUsd"),
  //       totalPriceLbp: Number(totalAmount()) * usdRate.usdRate,
  //       taxesLbp: Number(vatAmount) * usdRate.usdRate,
  //       customer: {
  //         name: getValues("customer")?.label || "",
  //         address: getValues("customer")?.address,
  //         tvaNumber: getValues("customer")?.tvaNumber,
  //       },
  //       vehicle: getValues("vehicle"),
  //     });
  //   }
  // };

  useEffect(() => {
    let totalWithDiscount = 0;

    // Handle discount calculation
    if (discountStore.type === "fixed") {
      totalWithDiscount = +cartSum() - discountStore.amount;
    } else {
      totalWithDiscount = +cartSum() - cartSum() * discountStore.amount * 0.01;
    }

    // Calculate VAT
    const vat = (
      totalWithDiscount * (Number(organization?.tvaPercentage) * 0.01) || 0
    ).toFixed(2);

    setVatAmount(Number(vat));
  }, [discountStore.amount, discountStore.type, cartSum()]);

  // totalAmount() from usePosStore represent the

  const resetForm = () => {
    reset({
      driverName: "",
      discount: {
        amount: 0,
        type: "fixed",
      },
      paidAmountUsd: 0,
      customerId: "",
      isPaid: false,
      hasVehicle: true,
      vehicleId: "",
      generalNote: "",
      customerNote: "",
      invoiceNumber: 0,
      items: [],
    });
  };
  const handleCancelEditing = () => {
    setEditingInvoice();
    clearPosStore();
    resetForm();
    router.back();
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="bg-white min-h-full -mr-[1.5rem]  pt-3 px-3 lex flex-col justify-between "
    >
      <span ref={printRef} data-hs-overlay="#print-invoice"></span>
      <div className="grid grid-cols-2 gap-x-2 items-center justify-between ">
        <button
          type="button"
          className=" col-span-2 p-2  rounded-md bg-primary border border-primary text-white hover:bg-white hover:text-primary mb-1"
          data-hs-overlay="#general-invoice-info-modal"
        >
          General Info
        </button>
        <SelectFieldControlled
          control={control}
          label="Customer Type"
          name="type"
          colSpan={1}
          creatable={false}
          options={customerTypeOption}
        />
        <NumberFieldControlled
          control={control}
          name="paidAmountUsd"
          label="USD"
          colSpan={1}
          prefix="$"
        />
        {/* items list */}
        <ItemsList />
        {/* items list */}
        <NumberFieldControlled
          control={control}
          name="discount.amount"
          label="Discount"
          colSpan={1}
          onChangeValue={(val) =>
            applyDiscount(Number(val) || 0, discountStore.type)
          } // Pass amount and type correctly
        />

        <SelectFieldControlled
          control={control}
          label="Type"
          name="discount.type"
          colSpan={1}
          creatable={false}
          options={discountTypeOptions}
          onChangeValue={(val) => {
            const type = val === "fixed" ? "fixed" : "percentage";
            applyDiscount(discountStore.amount, type);
          }} // Pass type correctly
        />
        {/*  */}
        <div className="h-[15vh] mb-4 col-span-2 p-2 rounded-md bg-gray-300">
          <div className="flex items-center justify-between mt-1">
            <span>Sub Total</span>
            <span>${cartSum()}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-danger">{`Discount`}</span>
            <span className="text-danger">{`${
              discountStore.type === "fixed" ? "$" : "%"
            }${discountStore.amount || 0}`}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>{`TVA(${organization?.tvaPercentage}%)`}</span>
            <span>${vatAmount}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Total</span>
            <span>${totalAmount()}</span>
          </div>
        </div>
        {/*  */}
      </div>
      <div>
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              label="Full Paid"
              onValueChange={() => {
                if (isFullPaid) {
                  setValue("paidAmountUsd", 0);
                  setIsFullPaid(false);
                } else {
                  setValue("paidAmountUsd", +totalAmount());
                  setIsFullPaid(true);
                }
              }}
              isChecked={isFullPaid}
            />
            <Checkbox
              label="No Vehicle"
              isChecked={!hasVehicle}
              onValueChange={() => setValue("hasVehicle", !hasVehicle)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          {!editingInvoice ? (
            <button
              onClick={() => {
                reset();
                clearPosStore();
              }}
              type="button"
              className="p-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
            >
              Reset
            </button>
          ) : (
            <button
              type="button"
              className="p-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => handleCancelEditing()}
            >
              Cancel
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              // onClick={() => setPrevInv()}
              data-hs-overlay="#preview-invoice"
              className="flex gap-1 items-center p-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
            >
              <FaEye className="h-full aspect-square" />
            </button>

            <button
              type="submit"
              onClick={() => setIsPrint(true)}
              className="flex gap-1 items-center p-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
            >
              print
              <FaPrint className="w-3 h-3" />
            </button>
            <button
              type="submit"
              className="p-2 rounded-md bg-primary border border-primary text-white hover:bg-white hover:text-primary"
            >
              {mutation.isPending || isEditInvoicePending
                ? "Saving..."
                : "Save"}
            </button>
          </div>
        </div>
      </div>

      <GeneralInfoModal
        modalTitle="General Info"
        triggerModalId="general-invoice-info-modal"
      />
      <PrintInvoiceModal
        triggerModalId="print-invoice"
        title="New Inovice"
        printingInvoices={invoice ? [invoice] : undefined}
      />
      {/* <PrintInvoiceModal
        triggerModalId="preview-invoice"
        title="New Inovice"
        previewingInvoice={previewingInvoice}
        prev={true}
      /> */}
    </form>
  );
}

export default RightSideAddOrder;
