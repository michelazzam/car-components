import Modal from "@/shared/Modal";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCaisse } from "@/api-hooks/caisse/use-get-caisse";
import { z } from "zod";
import NumberFieldControlled from "../../admin/FormControlledFields/NumberFieldControlled";
import { useOpenCaisse } from "@/api-hooks/caisse/use-open-caisse";
import { useCloseCaisse } from "@/api-hooks/caisse/use-close-caisse";
import { IoAlertCircleOutline } from "react-icons/io5";

const OpenCloseCaisseModal = ({
  triggerModalId,
  title,
}: {
  triggerModalId: string;
  title: string;
}) => {
  const openCloseCaisse = z.object({
    amount: z.number(),
  });

  //---------------------------REFS------------------------------
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  //------------------------API----------------------------------
  const { data: caisseStatus } = useGetCaisse();
  const { mutate: openCaisse, isPending: isOpenCaissePending } = useOpenCaisse({
    callBackOnSuccess: () => {
      cancelFormRef?.current?.click();
    },
  });
  const { mutate: closeCaisse, isPending: isCloseCaissePending } =
    useCloseCaisse({
      callBackOnSuccess: () => {
        cancelFormRef?.current?.click();
      },
    });

  //-------------------------Form-----------------------------------
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(openCloseCaisse),
    defaultValues: {
      amount: 0,
    },
  });
  useEffect(() => {
    reset({
      amount: parseInt(caisseStatus?.caisse.toString() || "0"),
    });
  }, [caisseStatus, reset]);

  //------------------------Functions----------------------------------

  const onSubmit = (data: { amount: number }) => {
    if (caisseStatus?.isCaisseOpen) {
      closeCaisse(data);
    } else {
      openCaisse(data);
    }
  };

  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onClose={() => {
          reset({
            amount: 0,
          });
        }}
        onOpen={() => {
          reset({
            amount: caisseStatus?.caisse || 0,
          });
        }}
      >
        <Modal.Header title={title} id={triggerModalId} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="px-4 py-2 bg-info/10 text-info rounded-md gap-x-2 flex items-center">
              <IoAlertCircleOutline />
              <p>
                {caisseStatus?.isCaisseOpen
                  ? "You are about to close the caisse "
                  : "You are about to open the caisse "}
              </p>
            </div>
            <div className="grid grid-cols-12 gap-x-2 items-center justify-between">
              <NumberFieldControlled
                control={control}
                label={`Amount to ${
                  caisseStatus?.isCaisseOpen ? "close" : "open"
                } with`}
                prefix="$"
                name="amount"
                placeholder=""
                colSpan={12}
              />
            </div>
            <p>
              Note: The caisse value was : {caisseStatus?.caisse} before this
              action!
            </p>
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
            <button
              className="ti-btn ti-btn-primary-full"
              type="submit"
              disabled={isOpenCaissePending || isCloseCaissePending}
            >
              {isOpenCaissePending || isCloseCaissePending
                ? "Submitting..."
                : "Submit"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default OpenCloseCaisseModal;
