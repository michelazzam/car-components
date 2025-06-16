import Modal from "@/shared/Modal";
import React, { useEffect, useRef, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPaymentSchema, apiValidations } from "@/lib/apiValidations";
import { useAddPayment } from "@/api-hooks/customer/use-add-payment";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import { Customer } from "@/api-hooks/customer/use-list-customer";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { FaCalculator } from "react-icons/fa6";
import Tooltip from "@/components/common/Tooltip";
import { cn } from "@/utils/cn";
import PrintReceiptModal from "../loan-transactions/PrintReceiptModal";
import { LoanTransaction } from "@/api-hooks/money-transactions/use-list-loans-transactions";

function AddPaymentModal({
  triggerModalId,
  modalTitle,
  selectedCustomer,
  setSelectedCustomer,
}: {
  triggerModalId: string;
  modalTitle: string;
  selectedCustomer?: Customer;
  setSelectedCustomer?: React.Dispatch<
    React.SetStateAction<Customer | undefined>
  >;
}) {
  //---------------------------STATE------------------------------
  const [selectedTransaction, setSelectedTransaction] =
    useState<LoanTransaction | null>(null);

  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);
  const openPrintReceiptModalRef = useRef<HTMLButtonElement>(null);
  //---------------------------API----------------------------------

  const { mutate: addPayment, isPending: isAdding } = useAddPayment({
    callBackOnSuccess: (data) => {
      setSelectedTransaction(data.transaction);
      reset();
      openPrintReceiptModalRef.current?.click();
      cancelFormRef.current?.click();
    },
  });

  //---------------------------FORM---------------------------------
  type AddPaymentFormErrors = FieldErrors<AddPaymentSchema> & {
    payment?: {
      message?: string;
    };
  };
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<AddPaymentSchema, AddPaymentFormErrors>({
    resolver: zodResolver(apiValidations.AddPaymentSchema),
    defaultValues: {
      customerId: "",
      amount: 0,
      discount: 0,
    },
  });
  const watchDiscount = watch("discount");
  const watchAmount = watch("amount");

  const onSubmit = (data: AddPaymentSchema) => {
    if (selectedCustomer) {
      addPayment(data);
    } else {
      console.log("there is no data");
    }
  };

  // when clicking edit in the table, for the first ms, the state is not initialized, so we need to reset the form state
  useEffect(() => {
    if (selectedCustomer) {
      setValue("customerId", selectedCustomer._id || "");
    }
  }, [selectedCustomer]);

  // when pressing enter in the input field, we need to add the ingredient
  const onInvalid = (errors: any) => console.error(errors);
  const remaining =
    (selectedCustomer?.loan || 0) - watchAmount - (watchDiscount || 0);
  console.log("REMAINING AMOUNT", remaining);
  return (
    <>
      <Modal
        id={triggerModalId}
        size="sm"
        onClose={() => {
          reset({
            customerId: "",
            amount: 0,
            discount: 0,
          });
          setSelectedCustomer?.(undefined);
        }}
      >
        <Modal.Header title={modalTitle} id={triggerModalId} />
        <Modal.Body>
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="grid grid-cols-12 gap-x-2 items-center"
          >
            <div className="col-span-12 mb-2">
              <p className="">
                Loan Amount:{" "}
                <span className="text-danger">
                  {formatNumber(selectedCustomer?.loan || 0, 2)}$
                </span>
              </p>
              <p className="">
                The Remaining Amount will be:{" "}
                <span
                  className={cn(remaining > 0 ? "text-danger" : "text-success")}
                >
                  {formatNumber(remaining, 2)}$
                </span>
              </p>
            </div>
            <NumberFieldControlled
              control={control}
              name="amount"
              label="Amount Paid in USD"
              placeholder="amount paid in USD"
              colSpan={6}
              prefix="$"
            />
            <div className="relative col-span-6">
              <NumberFieldControlled
                decimalsLimit={2}
                control={control}
                name="discount"
                label="Discount Amount in USD"
                placeholder="xxx $"
                colSpan={6}
                prefix="$"
              />

              <button
                type="button"
                onClick={() => {
                  setValue(
                    "discount",
                    (selectedCustomer?.loan || 0) - getValues().amount || 0
                  );
                }}
                className="ti ti-btn ti-btn-secondary absolute top-1/2 right-2 -translate-y-1/2"
              >
                <Tooltip content="Apply Full Paid" position="left">
                  <FaCalculator />
                </Tooltip>
              </button>
            </div>
            {/* Displaying refine error */}

            <div className="h-4 col-span-12">
              {
                //@ts-ignore
                errors.payment && (
                  //@ts-ignore
                  <div className="text-red">{errors.payment.message}</div>
                )
              }
            </div>
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
            // disabled={false}
            type="submit"
            onClick={() => {
              formRef.current?.requestSubmit();
            }}
            className="ti-btn ti-btn-primary-full"
          >
            {isAdding ? "Submitting..." : "Submit"}
          </button>
          <button
            data-hs-overlay={`#print-receipt-modal`}
            ref={openPrintReceiptModalRef}
            type="button"
            className="sr-only"
          >
            Print Receipt
          </button>
        </Modal.Footer>
      </Modal>
      <PrintReceiptModal
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        triggerModalId={"print-receipt-modal"}
        title="Payment Receipt"
      />
    </>
  );
}

export default AddPaymentModal;
