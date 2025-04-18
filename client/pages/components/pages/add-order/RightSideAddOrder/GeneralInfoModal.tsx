import Modal from "@/shared/Modal";
import React, { useRef } from "react";
import TextFieldControlled from "@/pages/components/admin/FormControlledFields/TextFieldControlled";
import { useFormContext } from "react-hook-form";
import NumberFieldControlled from "@/pages/components/admin/FormControlledFields/NumberFieldControlled";

const GeneralInfoModal = ({
  triggerModalId,
  modalTitle,
}: {
  triggerModalId: string;
  modalTitle: string;
}) => {
  //-------------------------Form Storage--------------------
  const formContext = useFormContext();
  if (!formContext) return <div>Loading...</div>;

  const { control } = formContext;
  //---------------------------REFS------------------------------
  const cancelFormRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onOpen={() => {
          console.log("open");
        }}
        onClose={() => {}}
      >
        <Modal.Header title={modalTitle} id={triggerModalId} />
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <Modal.Body>
          <NumberFieldControlled
            control={control}
            label="Invoice Number"
            name="invoiceNumber"
            placeholder="Nb."
            colSpan={1}
          />
          <TextFieldControlled
            control={control}
            label="Driver Name"
            name="driverName"
            placeholder="type name"
            colSpan={1}
          />
          <TextFieldControlled
            control={control}
            label="General Note"
            name="genralNote"
            placeholder="note"
            colSpan={2}
          />
          <TextFieldControlled
            control={control}
            label="Customer Note"
            name="customerNote"
            placeholder="note"
            colSpan={2}
          />
        </Modal.Body>

        <Modal.Footer>
          <button
            ref={cancelFormRef}
            type="button"
            className="hs-dropdown-toggle ti-btn ti-btn-secondary-full"
            data-hs-overlay={`#${triggerModalId}`}
            onClick={() => console.log("cancel")}
          >
            Close
          </button>
          <button
            ref={cancelFormRef}
            type="button"
            disabled={false}
            className="ti-btn ti-btn-primary-full"
            data-hs-overlay={`#${triggerModalId}`}
            onClick={() => console.log("save")}
          >
            Save
          </button>
        </Modal.Footer>
        {/* </form> */}
      </Modal>
    </div>
  );
};

export default GeneralInfoModal;
