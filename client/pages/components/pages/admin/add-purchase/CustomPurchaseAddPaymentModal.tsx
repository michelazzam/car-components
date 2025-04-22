import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { usePurchase } from "../../../../stores/usePurchase";
import Modal from "../../Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "../../../../../lib/apiValidation";
import { useForm } from "react-hook-form";
import InputField from "../../../../components/Admin/fields/InputField";

const CustomPurchaseAddPaymentModal = () => {
  const { addPayment, payment } = usePurchase();

  //----------------------------------REFS------------------------------------
  /** @type {React.MutableRefObject<HTMLButtonElement | null>} */
  const cancelModalRef = useRef(null);
  //----------------------------------FORM SETUP------------------------------------
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: zodResolver(apiValidations.AddPurchasePayment),
    defaultValues: {
      fromCaisse: payment.fromCaisse,
      fromCaisseLbp: payment.fromCaisseLbp,
      fromBalance: payment.fromBalance,
      notes: payment.notes,
    },
  });
  //----------------------------------EFFECTS------------------------------------

  //----------------------------------HANDLERS------------------------------------
  const onSubmit = (data: any) => {
    addPayment({
      fromCaisse: data.fromCaisse,
      fromCaisseLbp: data.fromCaisseLbp,
      fromBalance: data.fromBalance,
      notes: data.notes,
    });
    cancelModalRef.current && cancelModalRef.current.click();
  };

  const onError = (errors = {}) => {
    console.log("error", errors);
  };

  const handleOpen = () => {
    setValue("fromCaisse", payment.fromCaisse);
    setValue("fromBalance", payment.fromBalance);
    setValue("fromCaisseLbp", payment.fromCaisseLbp);
    setValue("notes", payment.notes);
  };
  return (
    <>
      {/* Add Category */}

      <Modal id="add-payment" onOpen={handleOpen} props={undefined}>
        <Modal.Header title="Add Payment" />
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="row">
              <InputField
                colSpan={6}
                control={control}
                name="fromCaisse"
                label="From Caisse"
                type="formattedNumber"
                prefix="$"
                placeholder="100$"
              />
              <InputField
                colSpan={6}
                control={control}
                name="fromCaisseLbp"
                label="From Caisse LBP"
                type="formattedNumber"
                prefix="LBP"
                placeholder="100,000 LBP"
              />
              <InputField
                colSpan={12}
                control={control}
                name="fromBalance"
                label="From Balance"
                type="formattedNumber"
                prefix="$"
              />
              <InputField
                colSpan={12}
                control={control}
                name="notes"
                label="Notes"
                type="text"
                placeholder="Notes"
              />
            </div>

            <div className="modal-footer-btn">
              <button
                type="button"
                className="btn btn-cancel me-2"
                data-bs-dismiss="modal"
                ref={cancelModalRef}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-submit">
                save
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* /Add Category */}
    </>
  );
};

export default CustomPurchaseAddPaymentModal;
