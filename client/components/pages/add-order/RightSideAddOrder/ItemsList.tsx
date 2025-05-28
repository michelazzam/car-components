import React, { useState } from "react";
import { Item, usePosStore } from "@/shared/store/usePosStore";
import IncDecButton from "../IncDecButton";
import { FaRegTrashCan } from "react-icons/fa6";
import AddItemDiscountModal from "./AddItemDiscountModal";
import { CSOS } from "@/constants/preferences";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { AddInvoiceSchema } from "@/lib/apiValidations";

function ItemsList({
  swapsFieldArrayMethods,
}: {
  swapsFieldArrayMethods: UseFieldArrayReturn<AddInvoiceSchema, "swaps">;
}) {
  const [selectedItem, setSelectedItem] = useState<Item>();
  //-----------store---
  const { cart, setQuantity, removeItem, clearCart } = usePosStore();
  const { watch } = useFormContext<AddInvoiceSchema>();
  const swaps = watch("swaps") || [];

  const handleDec = (item: Item) => {
    if (item.quantity === 1) return;
    setQuantity(item.name || "", item.price || 0, (item.quantity || 0) - 1);
  };

  const handleInc = (item: Item) => {
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

  // Swaps handlers
  const { update, remove, fields } = swapsFieldArrayMethods;

  const handleSwapDec = (index: number) => {
    const currentQuantity = swaps[index]?.quantity ?? 0;
    if (currentQuantity <= 1) return;
    update(index, { ...swaps[index], quantity: currentQuantity - 1 });
  };

  const handleSwapInc = (index: number) => {
    const currentQuantity = swaps[index]?.quantity ?? 0;
    update(index, { ...swaps[index], quantity: currentQuantity + 1 });
  };

  const handleSwapChangeValue = (index: number, val: number) => {
    if (val < 1) val = 1; // minimum quantity 1
    update(index, { ...swaps[index], quantity: val });
  };

  const handleSwapRemove = (index: number) => {
    remove(index);
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex items-center justify-between ">
        <div>
          <p>Products & Services Added</p>
        </div>
        {cart.length > 0 && (
          <span
            onClick={() => clearCart()}
            className="text-danger hover:cursor-pointer"
          >
            Clear all X
          </span>
        )}
      </div>
      <div className="col-span-2 h-[27vh] overflow-y-auto flex-grow">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between px-0 py-2"
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
        {fields.map((field, index) => {
          const item = swaps[index] || field;
          return (
            <div
              key={item.itemName + field.id}
              className="flex items-center justify-between px-0 py-2"
            >
              <p className="w-1/4 hover:cursor-pointer hover:text-primary hover:font-bold">
                {item.itemName}
              </p>
              <IncDecButton
                dec={() => handleSwapDec(index)}
                inc={() => handleSwapInc(index)}
                size="sm"
                value={Number(item.quantity)}
                onChange={(val) => handleSwapChangeValue(index, val)}
              />
              <span className={`w-1/4 text-center text-danger`}>
                -{item.price * item.quantity}
              </span>
              <span
                className="w-1/4 flex items-center justify-center hover:cursor-pointer hover:text-danger"
                onClick={() => handleSwapRemove(index)}
              >
                <FaRegTrashCan className="w-[1rem] h-[1rem]" />
              </span>
            </div>
          );
        })}
      </div>
      {/* {selectedItem && ( */}
      <AddItemDiscountModal
        triggerModalId="add-item-discount"
        modalTitle={"Pricing & Discount of " + selectedItem?.name}
        item={selectedItem || cart[0]}
        setSelected={setSelectedItem}
      />
      {/* )} */}
    </div>
  );
}

export default ItemsList;
