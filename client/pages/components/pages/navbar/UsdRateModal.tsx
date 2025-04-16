import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import { UseEditUsdRate } from "@/api-hooks/usdRate/use-edit-usdRate";
import { z } from "zod";
import NumberField from "../../admin/FormFields/NumberField";

const UsdRateModal = ({
  triggerModalId,
  title,
}: {
  triggerModalId: string;
  title: string;
}) => {
  const changeUsdRate = z.object({
    usdRate: z.number().positive(),
  });

  //---------------------------REFS------------------------------
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //------------------------API----------------------------------
  const { data: currentUsdRate } = useGetUsdRate();

  const mutation = UseEditUsdRate({
    callBackOnSuccess: () => {
      reset();
      cancelFormRef.current?.click(); // Closes the modal
    },
  });

  //-------------------------Form-----------------------------------
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(changeUsdRate),
    defaultValues: {
      usdRate: 0,
    },
  });

  useEffect(() => {
    if (currentUsdRate) {
      reset({
        usdRate: parseInt(currentUsdRate.usdRate.toString()),
      });
    }
  }, [currentUsdRate, reset]);

  //------------------------Functions----------------------------------

  const onSubmit = (data: { usdRate: number }) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onClose={() => {
          reset();
        }}
        onOpen={() => {
          console.log("open");
        }}
      >
        <Modal.Header title={title} id={triggerModalId} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="grid grid-cols-12 gap-x-2 items-center justify-between">
              <NumberField
                control={control}
                label="USD Rate"
                name="usdRate"
                placeholder=""
                colSpan={12}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              ref={cancelFormRef}
              type="button"
              className="hs-dropdown-toggle ti-btn ti-btn-secondary-full"
              data-hs-overlay={`#${triggerModalId}`}
            >
              Close
            </button>
            <button className="ti-btn ti-btn-primary-full" type="submit">
              {mutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default UsdRateModal;
