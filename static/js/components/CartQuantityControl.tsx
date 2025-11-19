import React, { useCallback } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useCart } from "../context/CartContext.tsx";
import { GroupedProduct } from "../api/getGroupedProducts.ts";

interface CartQuantityControlProps {
  product: GroupedProduct;
}

const CartQuantityControl: React.FC<CartQuantityControlProps> = ({ product }) => {
  const { getQuantity, incrementQuantity, decrementQuantity } = useCart();
  const productId = product.data[0]?.id || "";
  const quantity = getQuantity(productId);

  const handleIncrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      incrementQuantity(product);
    },
    [incrementQuantity, product],
  );

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      decrementQuantity(product);
    },
    [decrementQuantity, product],
  );

  return (
    <>
      {quantity > 0 ? (
        <div className="flex items-center rounded border border-action bg-bg">
          <button className="px-1.5 py-0.5 font-bold text-action dark:text-white" onClick={handleDecrement}>
            <IconMinus size={12} stroke={2} />
          </button>
          <span className="px-2 text-xs font-medium text-action dark:text-white">{quantity}</span>
          <button className="px-1.5 py-0.5 text-action dark:text-white" onClick={handleIncrement}>
            <IconPlus size={12} stroke={2} />
          </button>
        </div>
      ) : (
        // Temporarily hide the compare button
        // null
        <button
          className="flex items-center justify-center rounded bg-action text-white px-2 py-1 text-xs font-medium"
          onClick={handleIncrement}>
          Compare
        </button>
      )}
    </>
  );
};

export default CartQuantityControl;
