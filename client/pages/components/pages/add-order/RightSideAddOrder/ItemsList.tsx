import React from "react";
import { Item, usePosStore } from "@/shared/store/usePosStore";
import IncDecButton from "../IncDecButton";
import { FaRegTrashCan } from "react-icons/fa6";

function ItemsList() {
  const { cart, setQuantity, removeItem, clearCart } = usePosStore();

  const handleDec = (item: Item) => {
    if (item.quantity === 1) return;
    setQuantity(item.name || "", item.price || 0, (item.quantity || 0) - 1);
  };

  const handleInc = (item: Item) => {
    setQuantity(
      item.name || "",
      item.price || 0,
      item.productId && item.quantity !== undefined && item.stock !== undefined
        ? item.quantity < item.stock
          ? item.quantity + 1
          : item.quantity
        : (item.quantity || 0) + 1
    );
  };
  const handleChangeValue = (item: Item, val: number) => {
    setQuantity(item.name || "", item.price || 0, +val);
  };

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
            <p className="w-1/4">{item.name}</p>
            <IncDecButton
              dec={() => handleDec(item)}
              inc={() => handleInc(item)}
              size="sm"
              value={Number(item.quantity)}
              onChange={(val) => handleChangeValue(item, val)}
            />
            <span className="w-1/4 text-center">{item.price}</span>
            <span
              className="w-1/4 flex items-center justify-center hover:cursor-pointer hover:text-danger"
              onClick={() => removeItem(item)}
            >
              <FaRegTrashCan className="w-[1rem] h-[1rem]" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsList;
