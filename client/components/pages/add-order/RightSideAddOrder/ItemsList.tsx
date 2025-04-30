import React, { useState } from "react";
import { Item, usePosStore } from "@/shared/store/usePosStore";
import IncDecButton from "../IncDecButton";
import { FaRegTrashCan } from "react-icons/fa6";
import AddItemDiscountModal from "./AddItemDiscountModal";
import { CSOS } from "@/constants/preferences";

function ItemsList() {
  const [selectedItem, setSelectedItem] = useState<Item>();
  //-----------store---
  const { cart, setQuantity, removeItem, clearCart } = usePosStore();

  const handleDec = (item: Item) => {
    if (item.quantity === 1) return;
    setQuantity(item.name || "", item.price || 0, (item.quantity || 0) - 1);
  };

  const handleInc = (item: Item) => {
    console.log("hasan test item data:", item);
    setQuantity(
      item.name || "",
      item.price || 0,
      item.productId && item.quantity !== undefined && item.stock !== undefined
        ? item.quantity < item.stock || CSOS
          ? item.quantity + 1
          : item.quantity
        : (item.quantity || 0) + 1
    );
  };
  const handleChangeValue = (item: Item, val: number) => {
    setQuantity(item.name || "", item.price || 0, +val);
  };

  console.log(cart);
  return (
    <div className="col-span-2">
      <div className="flex items-center justify-between ">
        <div>
          <p>Products & Services Added</p>
        </div>
        <span
          onClick={() => clearCart()}
          className="text-danger hover:cursor-pointer"
        >
          Clear all X
        </span>
      </div>
      <div className="col-span-2 h-[27vh] overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-4"
          >
            {item.type === "product" ? (
              <p
                className="w-1/4 hover:cursor-pointer hover:text-primary hover:font-bold"
                data-hs-overlay="#add-item-discount"
                title="Click to add discount"
                onClick={() => setSelectedItem(item)}
              >
                {item.name}
              </p>
            ) : (
              <p className="w-1/4">{item.name}</p>
            )}
            <IncDecButton
              dec={() => handleDec(item)}
              inc={() => handleInc(item)}
              size="sm"
              value={Number(item.quantity)}
              onChange={(val) => handleChangeValue(item, val)}
            />
            <span
              className={`w-1/4 text-center ${
                item.discount?.amount && item.discount?.amount > 0
                  ? "text-danger"
                  : ""
              }`}
            >
              {item.amount}
            </span>
            <span
              className="w-1/4 flex items-center justify-center hover:cursor-pointer hover:text-danger"
              onClick={() => removeItem(item)}
            >
              <FaRegTrashCan className="w-[1rem] h-[1rem]" />
            </span>
          </div>
        ))}
      </div>
      {/* {selectedItem && ( */}
      <AddItemDiscountModal
        triggerModalId="add-item-discount"
        modalTitle="Add Discount"
        item={selectedItem || cart[0]}
        setSelected={setSelectedItem}
      />
      {/* )} */}
    </div>
  );
}

export default ItemsList;
