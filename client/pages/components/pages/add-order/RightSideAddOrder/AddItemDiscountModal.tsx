import Modal from "@/shared/Modal";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import NumberField from "@/pages/components/admin/Fields/NumberField";
import SelectField from "@/pages/components/admin/Fields/SlectField";
import { discountTypeOptions } from "@/constants/constant";
import { Discount, Item, usePosStore } from "@/shared/store/usePosStore";

const AddItemDiscountModal = ({
  triggerModalId,
  modalTitle,
  item,
  setSelected,
}: {
  triggerModalId: string;
  modalTitle: string;
  item: Item;
  setSelected: Dispatch<SetStateAction<Item | undefined>>;
}) => {
  //----Store-----
  const { addItemDiscount } = usePosStore();
  //---------------------------REFS------------------------------
  const cancelFormRef = useRef<HTMLButtonElement>(null);
  // Local discount state
  const [discount, setDiscount] = useState<Discount>({
    amount: 0,
    type: "fixed",
  });

  useEffect(() => {
    console.log("effect:",item);
    if (item?.discount) {
      setDiscount({
        amount: item?.discount?.amount,
        type: item?.discount?.type ,
      });
    }
  }, [item]);

  //-------Function to save---
  const onSave = () => {
    if (item.productId) {
      addItemDiscount(item.productId, discount);
    }
    setDiscount({ amount: 0, type: "fixed" });
  };
  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onOpen={() => {
          console.log("open");
        }}
        onClose={() => {
          setSelected(undefined);
          setDiscount({ amount: 0, type: "fixed" });
        }}
      >
        <Modal.Header title={modalTitle} id={triggerModalId} />
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <Modal.Body>
          <NumberField
            label="Amount"
            colSpan={1}
            name="amount"
            value={discount.amount}
            onChange={(e) => {
              setDiscount((prev) => ({
                ...prev,
                amount: Number(e),
              }));
            }}
          />
          <SelectField
            label="Type"
            options={discountTypeOptions}
            value={discountTypeOptions.find((v) => v.value === discount.type)}
            colSpan={1}
            onChangeValue={(e) => {
              setDiscount((prev) => ({
                ...prev,
                type: (e?.value as "percentage" | "fixed") || "fixed",
              }));
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <button
            ref={cancelFormRef}
            type="button"
            className="hs-dropdown-toggle ti-btn ti-btn-secondary-full"
            data-hs-overlay={`#${triggerModalId}`}
            onClick={() => {
              setSelected(undefined);
              setDiscount({ amount: 0, type: "fixed" });
            }}
          >
            Close
          </button>
          <button
            ref={cancelFormRef}
            type="button"
            disabled={false}
            className="ti-btn ti-btn-primary-full"
            data-hs-overlay={`#${triggerModalId}`}
            onClick={() => onSave()}
          >
            Save
          </button>
        </Modal.Footer>
        {/* </form> */}
      </Modal>
    </div>
  );
};

export default AddItemDiscountModal;
