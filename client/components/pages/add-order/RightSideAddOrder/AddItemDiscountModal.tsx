import Modal from "@/shared/Modal";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import NumberField from "@/components/admin/Fields/NumberField";
import SelectField from "@/components/admin/Fields/SlectField";
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
  const { addItemDiscount, changeItemPrice } = usePosStore();
  //---------------------------REFS------------------------------
  const cancelFormRef = useRef<HTMLButtonElement>(null);
  // Local discount state
  const [discount, setDiscount] = useState<Discount>({
    amount: 0,
    type: "fixed",
  });

  const [itemCustomPrice, setItemCustomPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    console.log("effect:", item);
    if (item?.discount) {
      setDiscount({
        amount: item?.discount?.amount,
        type: item?.discount?.type,
      });
    }
  }, [item]);

  //-------Function to save---
  const onSave = () => {
    if (itemCustomPrice < item.cost) {
      console.log("CUSTOM PRICE:", itemCustomPrice);
      console.log("COST:", item.cost);
      setErrorMessage("Custom price cannot be less than the cost");
      return;
    }
    setErrorMessage(undefined);

    if (item.productId) {
      changeItemPrice(item.productId, itemCustomPrice);
      addItemDiscount(item.productId, discount);
    }
    setDiscount({ amount: 0, type: "fixed" });
    cancelFormRef.current?.click();
  };
  return (
    <div>
      <Modal
        id={triggerModalId}
        size="md"
        onOpen={() => {
          setItemCustomPrice(item?.price || 0);
        }}
        onClose={() => {
          setSelected(undefined);
          setDiscount({ amount: 0, type: "fixed" });
          setItemCustomPrice(0);
        }}
      >
        <Modal.Header title={modalTitle} id={triggerModalId} />
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <Modal.Body>
          <NumberField
            name="customPrice"
            value={itemCustomPrice}
            label={`Custom Price (Current Cost: ${item?.cost}$)`}
            colSpan={1}
            onChange={(e) => {
              setItemCustomPrice(e);
            }}
            errorMessage={errorMessage}
          />

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
            type="button"
            disabled={false}
            className="ti-btn ti-btn-primary-full"
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
