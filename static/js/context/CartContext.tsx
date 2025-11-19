import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { GroupedProduct } from "../api/getGroupedProducts.ts";

interface CartItem {
  product: GroupedProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  getQuantity: (productId: string) => number;
  incrementQuantity: (product: GroupedProduct) => void;
  decrementQuantity: (product: GroupedProduct) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("[CartContext] Cart state:", cartItems);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const getQuantity = useCallback(
    (productId: string) => {
      return cartItems.find((item) => item.product.data[0]?.id === productId)?.quantity || 0;
    },
    [cartItems],
  );

  const incrementQuantity = useCallback(
    (product: GroupedProduct) => {
      const existingItem = cartItems.find(
        (item) => item.product.data[0]?.id === product.data[0]?.id,
      );
      if (existingItem) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product.data[0]?.id === product.data[0]?.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        setCartItems((prev) => [...prev, { product, quantity: 1 }]);
      }
    },
    [cartItems],
  );

  const decrementQuantity = useCallback(
    (product: GroupedProduct) => {
      const existingItem = cartItems.find(
        (item) => item.product.data[0]?.id === product.data[0]?.id,
      );
      if (!existingItem) {
        return;
      }

      if (existingItem.quantity > 1) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product.data[0]?.id === product.data[0]?.id
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        );
      } else {
        setCartItems((prev) =>
          prev.filter((item) => item.product.data[0]?.id !== product.data[0]?.id),
        );
      }
    },
    [cartItems],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = useMemo(() => cartItems.length, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        getQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        totalItems,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
