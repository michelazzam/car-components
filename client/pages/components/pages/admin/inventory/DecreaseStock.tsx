import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations, IncreaseStockSchema } from "@/lib/apiValidations";
import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";
import { useIncreaseOrDecreaseStock } from "@/api-hooks/products/use-increase-or-decrease-stock";
import { Product } from "@/api-hooks/products/use-list-products";

function DecreaseStockModal({ product }: { product: Product | undefined }) {
  //---------------------------REFS------------------------------
  const formRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //---------------------------API----------------------------------
  const { mutate: increaseStock, isPending } = useIncreaseOrDecreaseStock({
    id: product?._id || "",
    callBackOnSuccess: () => {
      reset();
      setTimeout(() => {
        cancelFormRef.current?.click();
      }, 1);
    },
  });

  //---------------------------FORM---------------------------------
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(apiValidations.IncreaseStock),
    defaultValues: {
      amount: 1,
    },
  });

  const onSubmit = (data: IncreaseStockSchema) => {
    increaseStock({ amount: data.amount, action: "decrease" });
  };

  return (
    <Modal id="decrease-stock-modal" size="xs">
      <Modal.Header title="Decrease Stock" id="decrease-stock-modal" />
      <Modal.Body>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-x-2 items-center"
        >
          <NumberFieldControlled
            control={control}
            name="amount"
            label="Amount"
            colSpan={12}
            max={product?.quantity}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          disabled={isPending}
          ref={cancelFormRef}
          type="button"
          className="hs-dropdown-toggle ti-btn ti-btn-secondary"
          data-hs-overlay={`#decrease-stock-modal`}
        >
          Cancel
        </button>
        <button
          disabled={isPending}
          type="button"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          className="ti-btn ti-btn-primary-full"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DecreaseStockModal;
