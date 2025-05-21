import React from "react";
import { Product } from "@/api-hooks/products/use-list-products";
import { Item, usePosStore } from "@/shared/store/usePosStore";
import { cn } from "@/utils/cn";
import { CSOS } from "@/constants/preferences";
import Tooltip from "@/components/common/Tooltip";

function ItemCard({ product }: { product: Product }) {
  //----------------Storage----------------------------
  const { cart, addToCart, setQuantity } = usePosStore();
  // const productStock = 99999999;
  //------------------Functions--------------------
  const handleInc = (item: Item) => {
    setQuantity(item.name || "", item.price || 0, Number(item?.quantity) + 1);
  };

  const addItemToCart = () => {
    const isInCart = cart.find(
      (element) =>
        element.name === product?.name && element.price === product?.price
    );

    // If product is in the cart and there's stock left, increment quantity
    if (isInCart) {
      if (product?.quantity > Number(isInCart?.quantity) || CSOS) {
        handleInc(isInCart); // Increment quantity in the cart
      }
    } else {
      // If product is not in the cart, add it to the cart
      addToCart("product", product);
    }
  };

  const isInCart = cart.find(
    (item) => item.name === product?.name && item.price === product?.price
  );
  const itemCartQuantity = cart.reduce((acc, item) => {
    if (item.name === product?.name && item.price === product?.price) {
      return item?.quantity || 0;
    }
    return acc;
  }, 0);

  const outOfStock = product?.quantity < 1;

  return (
    <button
      disabled={outOfStock && !CSOS}
      onClick={addItemToCart}
      className={cn(
        "flex flex-col justify-between w-full h-full bg-white py-10 relative rounded-sm border disabled:opacity-80 disabled:cursor-not-allowed",
        outOfStock
          ? "border-danger"
          : "hover:border-success/80 shadow-[0_0_4px_0_rgba(0,0,0,0.1)]",
        isInCart ? "border-success" : ""
      )}
    >
      {/* product stock top left*/}
      <span
        className={cn(
          "absolute top-1 left-1 text-xs",
          outOfStock ? "text-danger" : "text-gray-600"
        )}
      >
        Stock: {product?.quantity}
      </span>

      {/* in cart count top right*/}
      {itemCartQuantity > 0 && (
        <span
          className={cn(
            "absolute top-1 right-1",
            product?.quantity - (isInCart?.quantity || 0) > 0
              ? "text-white rounded-lg bg-success px-2"
              : "text-white rounded-lg bg-danger px-2"
          )}
        >
          {itemCartQuantity}
        </span>
      )}
      <Tooltip content={product?.note || product.name}>
        <div className="flex-grow flex flex-col justify-center items-center w-full text-center p-2">
          <h3 className="font-semibold text-[.875rem] block text-truncate">
            {product?.name}
          </h3>
          <div className="text-success text-lg font-bold">
            $ {product?.price}
          </div>
          <p className="line-clamp-2">{product?.note}</p>
        </div>
      </Tooltip>
    </button>
  );
}

export default ItemCard;
