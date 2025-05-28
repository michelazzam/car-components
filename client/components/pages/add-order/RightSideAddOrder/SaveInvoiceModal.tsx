import Checkbox from "@/components/admin/Fields/Checkbox";
import NumberFieldControlled from "@/components/admin/FormControlledFields/NumberFieldControlled";
import Modal from "@/shared/Modal";
import { usePosStore } from "@/shared/store/usePosStore";
import React from "react";
import { useFormContext } from "react-hook-form";

function SaveInvoiceModal({
  triggerModalId,
  title,
  isFullPaid,
  setIsFullPaid,
  isPendingSubmittion,
}: {
  triggerModalId: string;
  title: string;
  isFullPaid: boolean;
  setIsFullPaid: React.Dispatch<React.SetStateAction<boolean>>;
  isPendingSubmittion: boolean;
}) {
  const { totalAmount } = usePosStore();
  const { control, setValue, getValues } = useFormContext();
  const isB2C = getValues("type") === "s2";

  return (
    <Modal
      onOpen={() => {
        setValue("paidAmountUsd", 0);
        setIsFullPaid(false);
      }}
      id={triggerModalId}
    >
      <Modal.Header title={title} id={triggerModalId} />
      <Modal.Body>
        <NumberFieldControlled
          control={control}
          name="paidAmountUsd"
          label="Amount Paid in USD"
          colSpan={2}
          prefix="$"
          readOnly={isFullPaid}
        />
        <div className="mt-2" />
        <Checkbox
          label="Full Paid"
          onValueChange={() => {
            if (isFullPaid) {
              setValue("paidAmountUsd", 0);
              setIsFullPaid(false);
            } else {
              setValue("paidAmountUsd", +totalAmount(!isB2C));
              setIsFullPaid(true);
            }
          }}
          isChecked={isFullPaid}
        />
      </Modal.Body>
      <Modal.Footer>
        <button
          disabled={isPendingSubmittion}
          type="submit"
          className="ti ti-btn ti-btn-primary"
        >
          {isPendingSubmittion ? "Saving Invoice..." : "Save Invoice"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveInvoiceModal;
