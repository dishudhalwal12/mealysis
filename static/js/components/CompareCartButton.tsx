import React from "react";
import { Link, useLocation } from "react-router";
import { useCart } from "../context/CartContext.tsx";

const CompareCartButton: React.FC = () => {
  // Temporarily hide the compare button
  // return null;
  
  const { totalItems, cartItems } = useCart();
  const { pathname } = useLocation();

  if (pathname === "/cart-comparison" || pathname === "/geolocation") {
    return null;
  }

  // Get up to 3 product images to display
  const productImages = cartItems.slice(0, 3).map(item => item.product.data[0]?.images?.[0]).filter(Boolean);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 w-full">
      {totalItems > 0 && (
        <div className="flex justify-center items-center pb-5">
          <Link
            to="/cart-comparison"
            className="border-[rgba(165, 255, 186, 1)] flex w-[280px] max-w-md items-center justify-center gap-3 rounded-full border bg-action px-6 py-3 text-white shadow-lg">
            
            {/* Product Images */}
            <div className="flex items-center -space-x-2">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Product"
                  className="h-6 w-6 rounded-full object-cover bg-white dark:bg-gray-700"
                  style={{ zIndex: index + 1 }}
                />
              ))}
              {cartItems.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-action dark:text-blue-500" style={{ zIndex: 4 }}>
                  +{cartItems.length - 3}
                </div>
              )}
            </div>
            
            <span className="font-medium">
              Compare {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CompareCartButton;
