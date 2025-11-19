import React, { useMemo } from "react";
import { useCart } from "../context/CartContext.tsx";
import { useNavigate } from "react-router";
import { IconChevronLeft, IconX, IconTrash, IconClock, IconShoppingCart } from "@tabler/icons-react";
import { openOutboundLink } from "../utils/marketplace.ts";
import CartQuantityControl from "../components/CartQuantityControl.tsx";
import { useMarketplace } from "../context/MarketplaceContext.tsx";
import { useConfirmationDialog } from "../context/ConfirmationDialogContext.tsx";

// Utility function to match platform names flexibly
const matchPlatform = (productPlatform: string, marketplacePlatform: string): boolean => {
  const productPlatformLower = productPlatform.toLowerCase();
  const marketplacePlatformLower = marketplacePlatform.toLowerCase();
  
  // Check for exact match first
  if (productPlatformLower === marketplacePlatformLower) return true;
  
  // Check for partial matches (e.g., "jio" matches "jiomart")
  if (productPlatformLower.includes(marketplacePlatformLower) || marketplacePlatformLower.includes(productPlatformLower)) return true;
  
  // Special handling for Jiomart variations
  if ((productPlatformLower.includes('jio') || productPlatformLower.includes('jiomart')) && 
      (marketplacePlatformLower.includes('jio') || marketplacePlatformLower.includes('jiomart'))) {
    return true;
  }
  
  return false;
};

const CartComparisonPage: React.FC = () => {
  const { marketplaceDetails } = useMarketplace();
  const { showConfirmation } = useConfirmationDialog();
  const { cartItems, clearCart, cartCreatedAt, cartCreatedAgo } = useCart();
  const navigate = useNavigate();

  // Filter marketplaces that have available products in cart
  const availableMarketplaces = useMemo(() => {
    if (!marketplaceDetails?.eta) return [];
    
    console.log('All marketplace details:', marketplaceDetails.eta);
    console.log('Cart items:', cartItems);
    
    // Add specific logging for Jiomart
    const jiomartMarketplace = marketplaceDetails.eta.find(m => 
      m.platform.toLowerCase().includes('jio') || m.platform.toLowerCase().includes('jiomart')
    );
    console.log('Jiomart marketplace found:', jiomartMarketplace);
    
    // Log all platform names in cart items for debugging
    const allPlatformsInCart = cartItems.flatMap(item => 
      item.product.data.map(p => ({
        platform: p.platform?.name,
        available: p.available,
        productName: p.name
      }))
    );
    console.log('All platforms in cart:', allPlatformsInCart);
    
    const filtered = marketplaceDetails.eta.filter(marketplace => {
      const hasProducts = cartItems.some(item => {
        // More flexible platform matching to handle potential naming inconsistencies
        const marketplaceProduct = item.product.data.find(
          (p) => matchPlatform(p.platform?.name || '', marketplace.platform)
        );        
        return marketplaceProduct; // Show all products, available or not
      });
      
      return hasProducts;
    });
    
    console.log('Filtered marketplaces:', filtered);
    return filtered;
  }, [cartItems, marketplaceDetails]);

  // Calculate width to take full available space
  const getMarketplaceColumnWidth = () => {
    const count = availableMarketplaces.length;
    if (count === 0) return 'w-16';
    if (count === 1) return 'flex-1'; // Take full available width
    if (count === 2) return 'flex-1'; // Each takes half
    if (count === 3) return 'flex-1'; // Each takes one-third
    if (count === 4) return 'flex-1'; // Each takes one-fourth
    return 'w-16'; // Fixed width for 5+ platforms
  };

  const cartTotalPriceByMarketplace = useMemo(() => {
    return cartItems.reduce((acc: Record<string, { mrp: number; offerPrice: number }>, item) => {
      availableMarketplaces.forEach((marketplace) => {
        const marketplaceProduct = item.product.data.find(
          (p) => matchPlatform(p.platform?.name || '', marketplace.platform)
        );
        if (marketplaceProduct && marketplaceProduct.available) {
          if (!acc[marketplace.platform]) {
            acc[marketplace.platform] = { mrp: 0, offerPrice: 0 };
          }
          acc[marketplace.platform].mrp += marketplaceProduct.mrp * item.quantity;
          acc[marketplace.platform].offerPrice +=
            parseFloat(marketplaceProduct.offer_price.toString()) * item.quantity;
        }
      });
      return acc;
    }, {});
  }, [cartItems, availableMarketplaces]);


  // Calculate available items per platform
  const getAvailableItemsPerPlatform = (platformName: string) => {
    return cartItems.reduce((total, item) => {
      const marketplaceProduct = item.product.data.find(
        (p) => matchPlatform(p.platform?.name || '', platformName)
      );
      if (marketplaceProduct && marketplaceProduct.available) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const handleClearCart = async () => {
    const confirmed = await showConfirmation({
      title: "Clear Cart",
      text: "Are you sure you want to clear your cart?",
    });

    if (confirmed) {
      clearCart();
    }
  };

  // Empty state when no items in cart
  if (cartItems.length === 0) {
    return (
      <div className="flex h-full min-w-[370px] flex-col">
        <div className="fixed z-50 mx-auto w-full max-w-[800px] rounded-b-2xl shadow bg-white dark:bg-bg">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col py-4">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                  <button onClick={() => navigate(-1)} className="mr-4 text-text dark:text-text-dark">
                    <IconChevronLeft size={24} />
                  </button>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-text dark:text-text-dark">Cart Comparison</h1>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      BETA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-8 mt-20">
          <IconShoppingCart size={64} className="text-text-light-dark dark:text-text-light mb-4" />
          <h2 className="text-xl font-semibold text-text dark:text-text-dark mb-2">Nothing here yet</h2>
          <p className="text-text-light-dark dark:text-text-light text-center mb-6 max-w-md">
            Please start adding items to your cart to compare prices across different platforms
          </p>
          <button
            onClick={() => navigate("/")}
            className="border-[rgba(165, 255, 186, 1)] flex w-[280px] max-w-md items-center justify-center gap-3 rounded-full border bg-action px-6 py-3 text-white shadow-lg font-medium hover:bg-action-dark transition-colors">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-[370px] flex-col">
      {/* Header */}
      <div className="fixed z-50 mx-auto w-full max-w-[800px] rounded-b-2xl shadow bg-white dark:bg-bg">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col py-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4 text-text dark:text-text-dark">
                  <IconChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold text-text dark:text-text-dark">Cart</h1>
                <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  BETA
                </span>
              </div>
              {cartCreatedAt && (
                <div className="mr-2 flex items-center text-2xs text-text-light-dark dark:text-text-light">
                  <IconClock size={14} className="mr-1" />
                  <span>{cartCreatedAgo}</span>
                </div>
              )}
              <button
                onClick={handleClearCart}
                className="text-red hover:bg-red/10 flex items-center gap-1 rounded-md px-2 py-1 transition-colors">
                <IconTrash size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-auto mt-20 bg-bg dark:bg-bg">
        <div className="flex w-full">
          <div className="sticky left-0 z-20 flex flex-shrink-0 flex-col bg-bg dark:bg-bg">
            <div className="sticky top-0 z-20 h-[110px] bg-bg dark:bg-bg" />
            {/* Cart Items */}
            {cartItems.map((item, index) => (
              <div
                key={item.product.data[0]?.id}
                className={`flex min-h-[88px] w-40 flex-col justify-center px-1 ${
                  index % 2 === 0 ? 'bg-white dark:bg-grey-dark' : 'bg-grey-light dark:bg-bg'
                }`}>
                <div className="flex items-center">
                  <img
                    src={item.product.data[0]?.images[0] || "/placeholder-image.png"}
                    alt={item.product.data[0]?.name}
                    className="mr-2 h-12 w-12 rounded object-contain"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="line-clamp-3 text-2xs text-text dark:text-text-dark">{item.product.data[0]?.name}</span>
                    <span className="text-3xs text-text-light-dark dark:text-text-light">
                      {item.product.data[0]?.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex justify-start pl-14">
                  <CartQuantityControl product={item.product} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col bg-bg dark:bg-bg">
            <div className="sticky top-0 flex min-h-[110px] flex-shrink-0 bg-bg dark:bg-bg">
              {/* Marketplace Details & Total Price */}
              {availableMarketplaces.map((marketplace, index) => {
                const totalPrice = cartTotalPriceByMarketplace[marketplace.platform]?.offerPrice || 0;
                const availableItems = getAvailableItemsPerPlatform(marketplace.platform);
                
                return (
                  <div
                    key={marketplace.platform}
                    className={`${getMarketplaceColumnWidth()} flex flex-shrink-0 flex-col items-center${
                      index < availableMarketplaces.length - 1 ? 'border-r border-grey-light dark:border-grey-dark' : ''
                    }`}>
                    <div className="h-10 w-full flex items-start justify-center">
                      <img
                        className="h-full w-full object-contain"
                        src={marketplace.image}
                        alt={marketplace.platform}
                      />
                    </div>
                    {marketplace.eta ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xs text-text-light-dark dark:text-text-light">{marketplace.eta}</span>
                        <span className="text-3xs text-text-light-dark dark:text-text-light">
                          {getAvailableItemsPerPlatform(marketplace.platform)} items
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="rounded bg-red px-2 py-1 text-3xs font-bold text-bg">
                          Closed
                        </span>
                        <span className="text-3xs text-text-light-dark dark:text-text-light">
                          {getAvailableItemsPerPlatform(marketplace.platform)} items
                        </span>
                      </div>
                    )}
                    <div className={`${getMarketplaceColumnWidth()} flex flex-shrink-0 flex-col items-center`}>
                      {availableItems > 0 ? (
                        <>
                          <span className="text-2xs font-semibold text-text dark:text-text-dark">
                            ₹{totalPrice}
                          </span>
                          <span className="text-text-light-dark dark:text-text-light text-3xs line-through">
                            ₹{cartTotalPriceByMarketplace[marketplace.platform]?.mrp || 0}
                          </span>
                        </>
                      ) : (
                        <span className="text-red text-2xs font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1">
              {/* Marketplace Availability */}
              {cartItems.map((item, itemIndex) => (
                <div key={item.product.data[0]?.id} className="flex">
                  {availableMarketplaces.map((marketplace, index) => {
                    const marketplaceProduct = item.product.data.find(
                      (p) => matchPlatform(p.platform?.name || '', marketplace.platform)
                    );
                    return (
                      <div
                        key={marketplace.platform}
                        className={`${getMarketplaceColumnWidth()} flex min-h-[88px] flex-shrink-0 cursor-pointer flex-col items-center justify-center ${
                          itemIndex % 2 === 0 ? 'bg-white dark:bg-grey-dark' : 'bg-grey-light dark:bg-bg'
                        } ${
                          index < availableMarketplaces.length - 1 ? 'border-r border-grey-light dark:border-grey-dark' : ''
                        }`}
                        title={"Open in " + marketplace.platform}
                        onClick={() => marketplaceProduct && marketplaceProduct.available && openOutboundLink(marketplaceProduct)}>
                        {marketplaceProduct ? (
                          <div className={`text-center ${!marketplaceProduct.available ? 'opacity-40' : ''}`}>
                            <div className="text-2xs font-medium text-text dark:text-text-dark">
                              ₹{marketplaceProduct.offer_price * item.quantity}
                            </div>
                            {marketplaceProduct.mrp !== marketplaceProduct.offer_price && (
                              <div className="text-text-light-dark dark:text-text-light text-3xs line-through">
                                ₹{marketplaceProduct.mrp * item.quantity}
                              </div>
                            )}
                            {!marketplaceProduct.available && (
                              <div className="text-red text-2xs font-medium mt-1">
                                Out of Stock
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <IconX className="text-red" size={20} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartComparisonPage;

