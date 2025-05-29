"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemsList from "./ItemsList";

import { usePosStore } from "@/shared/store/usePosStore";
import {
  SubmitHandler,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form";
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
import { customerTypeOption, discountTypeOptions } from "@/constants/constant";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import { Invoice } from "@/api-hooks/invoices/useListInvoices";
import SaveInvoiceModal from "./SaveInvoiceModal";
import ChooseDraftInvoiceModal from "./ChooseDraftInvoiceModal";
import { addInvoiceDefaultValues } from "@/pages/add-invoice";
import { FaSave } from "react-icons/fa";
import PulsingCircle from "@/components/common/animations/PulsingCircle";

function RightSideAddOrder({
  refetchProducts,
  swapsFieldArrayMethods,
}: {
  refetchProducts: () => void;
  swapsFieldArrayMethods: UseFieldArrayReturn<AddInvoiceSchema, "swaps">;
}) {
  //--------------------State-------------------------------------
  const { deleteCurrentDraftInvoice, clearPosStore, hasReadDraftInvoices } =
    usePosStore();
  const [printingInvoice, setPrintingInvoice] = useState<Invoice | undefined>();
  const [shouldPrint, setShouldPrint] = useState(false);
  const [isFullPaid, setIsFullPaid] = useState(false);
  const [previewingInvoice, setPreviewingInvoice] = useState<Invoice>();

  //--------------------Refs-------------------------------------
  const saveInvoiceRef = useRef<HTMLButtonElement>(null);
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
    cart,
  } = usePosStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  //---------------------Router----------------------------------------
  const router = useRouter();

  //----------------------Form Stroage---------------------------------
  const formContext = useFormContext<AddInvoiceSchema>();
  if (!formContext) return <div>Loading...</div>;

  const swaps = formContext.watch("swaps") || [];
  const swapsTotal = swaps.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const { handleSubmit, control, setValue, reset, getValues } = formContext;
  const isB2C = getValues("type") === "s2";

  //-----------------------API Calls------------------------------------

  const { data: usdRate } = useGetUsdRate();
  const { data: organization } = useGetOrganization();
  // const { data: usdRate } = useGetUsdRate();
  const successFunction = () => {
    refetchProducts();
    if (!editingInvoice) {
      deleteCurrentDraftInvoice();
    }
    reset(addInvoiceDefaultValues);
    clearPosStore();
    setIsFullPaid(false);

    if (editingInvoice) {
      setEditingInvoice(undefined);

      if (!shouldPrint) {
        setTimeout(() => {
          router.back();
        }, 1000);
      }
    } else {
      reset();
    }
  };

  const mutation = useAddInvoice({
    callBackOnSuccess: (resp: Invoice) => {
      console.log("SUCCESS ADD INVOICE");
      saveInvoiceRef.current?.click();
      successFunction();
      setPrintingInvoice(resp);

      if (shouldPrint) {
        printRef.current?.click();
      }
      setShouldPrint(false);
    },
  });

  const { mutate: editInvoice, isPending: isEditInvoicePending } =
    useEditInvoice({
      id: editingInvoice?._id || "",
      callBackOnSuccess: (resp: Invoice) => {
        saveInvoiceRef.current?.click();
        successFunction();
        setPrintingInvoice(resp);
        if (shouldPrint) {
          printRef.current?.click();
        }
        setShouldPrint(false);
      },
    });

  //------------------------------Functions-------------------------------------
  const onSubmit: SubmitHandler<AddInvoiceSchema> = (
    data: AddInvoiceSchema
  ) => {
    if (data.items && data.items.length < 1) {
      return toast.error("please add products or services");
    }

    if (isFullPaid || data.paidAmountUsd !== 0 || data.paidAmountUsd !== 0) {
      data.isPaid = true;
    } else {
      data.isPaid = false;
    }

    // set vehicleId undefined in case it's empty string
    if (data.vehicleId === "") {
      data.vehicleId = undefined;
    }
    if (data.type === "s2") {
      data.taxesUsd = 0;
    }
    if (editingInvoice) {
      editInvoice(data);
    } else {
      mutation.mutate(data);
    }
    return;
  };

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

    if (isFullPaid) {
      setValue("paidAmountUsd", totalAmount(!isB2C));
    }
  }, [discountStore.amount, discountStore.type, cartSum()]);

  const handleCancelEditing = () => {
    setEditingInvoice();
    clearPosStore();
    reset(addInvoiceDefaultValues);
    router.back();
  };

  const onInvalid = (errors: any) => console.error(errors);

  const setPrevInv = () => {
    if (usdRate) {
      setPreviewingInvoice({
        _id: "",
        type: getValues("type"),
        swaps: getValues("swaps") || [],
        paymentMethods: getValues("paymentMethods"),
        accounting: {
          isPaid: false,
          usdRate: usdRate.usdRate,
          discount: discountStore,
          taxesUsd: getValues("taxesUsd"),
          subTotalUsd: getValues("subTotalUsd"),
          totalUsd: getValues("totalUsd"),
          paidAmountUsd: getValues("paidAmountUsd"),
        },
        createdAt: "",

        customerNote: getValues("customerNote"),
        number: editingInvoice?.number || "",

        items: cart.map((item) => {
          const subtotal = (item.amount || 0) * (item.quantity || 0);
          const discountAmount = item?.discount?.amount || 0;
          const discount =
            item.discount?.type === "fixed"
              ? discountAmount
              : (discountAmount / 100) * subtotal;
          return {
            price: item.amount || 0,
            quantity: item.quantity || 0,
            name: item.name || "",
            subTotal: subtotal,
            cost: 0,
            totalPrice: subtotal - discount,
          };
        }),
        // totalPriceLbp: Number(totalAmount) * usdRate.usdRate,
        // taxesLbp: Number(vatAmount) * usdRate.usdRate,
        customer: {
          name: getValues("customer")?.label || "",
          phoneNumber: getValues("customer")?.phone,
          address: getValues("customer")?.address,
          tvaNumber: getValues("customer")?.tvaNumber,
        },
        // vehicle: getValues("vehicle"),
        vehicle: {
          ...getValues("vehicle"),
          model: getValues("vehicle")?.model || "NA",
          _id: "",
          number: "",
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="">
      <div className="bg-white min-h-full -mr-[1.5rem] flex pt-3 px-3 lex flex-col justify-between h-[calc(100vh-60px)] ">
        <span ref={printRef} data-hs-overlay="#print-invoice"></span>
        <div className="flex flex-col gap-x-2 items-center  flex-grow">
          <div className="grid grid-cols-2 gap-x-2 mb-2 w-full">
            <button
              type="button"
              className="ti ti-btn ti-btn-primary-full w-full relative flex items-center justify-center gap-x-1"
              data-hs-overlay="#choose-draft-invoice-modal"
            >
              <FaSave />
              Saved Invoices
              {!hasReadDraftInvoices && (
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 ">
                  <PulsingCircle />
                </div>
              )}
            </button>

            <button
              type="button"
              className="ti ti-btn ti-btn-primary"
              data-hs-overlay="#general-invoice-info-modal"
            >
              General Info
            </button>
          </div>
          <SelectFieldControlled
            control={control}
            label="Customer Type"
            name="type"
            creatable={false}
            options={customerTypeOption}
          />

          {/* items list */}
          <ItemsList swapsFieldArrayMethods={swapsFieldArrayMethods} />
          {/* items list */}
          <div className="w-full grid grid-cols-2 gap-x-2">
            <NumberFieldControlled
              control={control}
              name="discount.amount"
              label="Discount"
              colSpan={1}
              onChangeValue={(val) => {
                applyDiscount(Number(val) || 0, discountStore.type);
              }} // Pass amount and type correctly
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
          </div>

          {/*  */}
          {isClient && (
            <div className="h-[15vh] mb-4 w-full p-2 rounded-md bg-gray-300">
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
              {swaps.length > 0 && (
                <>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-danger">Swaps Discount</span>
                    <span className="text-danger">${swapsTotal}</span>
                  </div>
                </>
              )}
              {!isB2C && (
                <>
                  <div className="flex items-center justify-between mt-1">
                    <span>{`TVA(${organization?.tvaPercentage}%)`}</span>
                    <span>${vatAmount}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between mt-1">
                <span>Total</span>
                <span>${totalAmount(!isB2C)}</span>
              </div>
            </div>
          )}
          {/*  */}
        </div>
        <div>
          <div className="flex items-center justify-between mt-2">
            {!editingInvoice ? (
              <button
                onDoubleClick={() => {
                  reset(addInvoiceDefaultValues);
                  deleteCurrentDraftInvoice();
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
              {/* View Invoice  */}
              <button
                type="button"
                onClick={() => setPrevInv()}
                data-hs-overlay="#preview-invoice"
                className="flex gap-1 items-center p-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
              >
                <FaEye className="h-full aspect-square" />
              </button>

              <button
                type="button"
                data-hs-overlay="#save-invoice-modal"
                onClick={() => setShouldPrint(true)}
                className="flex gap-1 items-center p-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
              >
                print
                <FaPrint className="w-3 h-3" />
              </button>
              <button
                ref={saveInvoiceRef}
                type="button"
                data-hs-overlay="#save-invoice-modal"
                className="p-2 rounded-md bg-primary border border-primary text-white hover:bg-white hover:text-primary"
              >
                save
              </button>
            </div>
          </div>
        </div>

        <GeneralInfoModal
          modalTitle="General Info"
          triggerModalId="general-invoice-info-modal"
        />
        <ChooseDraftInvoiceModal
          triggerModalId="choose-draft-invoice-modal"
          modalTitle="Draft Invoices"
        />
        <PrintInvoiceModal
          triggerModalId="print-invoice"
          title="New Inovice"
          printingInvoices={printingInvoice ? [printingInvoice] : undefined}
        />

        {previewingInvoice && (
          <PrintInvoiceModal
            triggerModalId="preview-invoice"
            title="Preview Inovice"
            previewingInvoice={previewingInvoice}
            prev
          />
        )}

        <SaveInvoiceModal
          shouldPrint={shouldPrint}
          triggerModalId="save-invoice-modal"
          title="Save Invoice"
          isFullPaid={isFullPaid}
          setIsFullPaid={setIsFullPaid}
          isPendingSubmittion={mutation.isPending || isEditInvoicePending}
        />
      </div>
    </form>
  );
}

export default RightSideAddOrder;
