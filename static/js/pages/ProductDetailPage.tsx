import React from "react";
import GroupListItem from "../components/GroupListItem.tsx";
import ImageCarousel from "../components/ImageCarousel.tsx";
import { GroupedProduct } from "../api/getGroupedProducts.ts";
import { useLocation, useNavigate } from "react-router";
import { IconChevronLeft, IconShoppingCart } from "@tabler/icons-react";
import { useCart } from "../context/CartContext.tsx";
import { trackEvent } from '../utils/analytics.ts';
import { useGeolocation } from "../context/GeolocationContext.tsx";
import GoogleAdBanner from "../components/GoogleAdBanner.tsx";

export default function ProductDetailPage() {
  const product: GroupedProduct = useLocation().state;
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { geolocation } = useGeolocation();
  
  // Get all unique images from the product data
  const allImages = React.useMemo(() => {
    const images = new Set<string>();
    product.data.forEach(item => {
      if (item.images && Array.isArray(item.images)) {
        item.images.forEach(img => {
          if (img) images.add(img);
        });
      }
    });
    
    // If no images found in arrays, try to get the first image from each item's images array
    if (images.size === 0) {
      product.data.forEach(item => {
        if (item.images && item.images.length > 0 && item.images[0]) {
          images.add(item.images[0]);
        }
      });
    }
    
    // Final fallback - use the first image from the first product
    if (images.size === 0 && product.data[0]?.images?.[0]) {
      images.add(product.data[0].images[0]);
    }
    
    return Array.from(images);
  }, [product.data]);
  
  const handleCartClick = () => {
    trackEvent("Cart Icon Clicked", geolocation, {
      total_items: totalItems,
      source: "product_detail_page"
    });
    navigate("/cart-comparison");
  };

  return (
    <>
      <div className="fixed z-50 mx-auto w-full max-w-[800px] rounded-b-2xl bg-white dark:bg-bg shadow">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col py-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4">
                  <IconChevronLeft size={24} className="text-text-dark dark:text-text-light" />
                </button>
                <h1 className="text-lg font-semibold text-text">Product Details</h1>
              </div>
              
              {/* Cart Icon */}
              {totalItems > 0 && (
                <button
                  onClick={handleCartClick}
                  className="relative flex items-center justify-center rounded-full p-2 transition-colors flex-shrink-0">
                  <IconShoppingCart size={20} className="text-gray-700 dark:text-white" />
                  <span className="absolute -top-0 -right-0 z-50 flex h-4 w-4 items-center justify-center rounded-full bg-bg-dark text-xs text-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-y-scroll bg-bg dark:bg-bg pt-20">
        {/* Image Carousel */}
        {allImages.length > 0 && (
          <div className="px-4 pb-4">
            <ImageCarousel 
              images={allImages} 
              alt={product.data[0]?.name || "Product"}
              product={product}
            />
          </div>
        )}
        
        {/* Product Details */}
        <GroupListItem product={product} detailView={true} />
      </div>
      <GoogleAdBanner
        key="/23312116132/quickcompare_web/qc_mpu"
        adSlot="/23312116132/quickcompare_web/qc_mpu"
        adFormat="auto"
        className="w-full"
      />
    </>
  );
}
