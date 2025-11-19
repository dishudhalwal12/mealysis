import CartQuantityControl from "./CartQuantityControl.tsx";
import React, { useEffect } from "react";
import { useGeolocation } from "../context/GeolocationContext.tsx";
import { trackEvent } from '../utils/analytics.ts';
import { IconClock, IconExternalLink } from "@tabler/icons-react";
import { GroupedProduct, GroupedProductOption } from "../api/getGroupedProducts.ts";
import { useNavigate } from "react-router";
const DEVICE_IDENTIFIER_KEY = 'device_identifier';

const GroupedProductListItem = ({ product, detailView }: { product: GroupedProduct, detailView: boolean }) => {
  const { geolocation } = useGeolocation()
  const productBrand = product.data[0]?.brand;
  const productName = product.data[0]?.name;
  const image = product.data[0]?.images?.[0];
  const navigate = useNavigate();

  const openProductDetailPage = () => {
    // Open a new webview or tab with the specified URL
    navigate("/product-detail", { state: product });
  };

  const affinityHandling = (option: GroupedProductOption) => {
    let deviceIdentifier = localStorage.getItem(DEVICE_IDENTIFIER_KEY);
    if (!deviceIdentifier) {
      deviceIdentifier =
        Math.random().toString(36).substring(2) +
        Date.now().toString(36);
      localStorage.setItem(DEVICE_IDENTIFIER_KEY, deviceIdentifier);
    }

    // Generate cid and subid (random, could be same generation for both)
    const generateRandomId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const cid = generateRandomId();
    const subid = generateRandomId();

    // Compose new URL
    const androidUrl = `https://ww55.affinity.net/sssdomweb?enk=055ebc28bde1d3ab65d1e042acaf8d68b88ce508c8ef99cd7c887129d9261a8a8c9247e2b88aba30bbcdc34adb788c8276ca6e70a64c858580356a4ac02f417526365d7ad5c64639c41f658610be5aa7&di=${deviceIdentifier}&cid=${cid}&subid=${subid}&qld=in.swiggy.android`;

    trackEvent("AffinitySwiggyList", geolocation, {
      cid: cid,
      subid: subid,
      click_url: androidUrl,
      platform: option.platform.name,
      product_name: productName,
      product_brand: productBrand,
      product_id: product.data[0]?.id,
      variant_id: option.id,
      platform_id: option.platform.storeId,
      product_quantity: option.quantity,
      image_url: image,
      price: option.offer_price,
      mrp: option.mrp,
      has_discount: option.mrp !== option.offer_price,
      available: option.available,
      total_variants: product.data.length,
      is_cheapest: option.offer_price === Math.min(...product.data.map(p => p.offer_price)),
      all_variant_ids: product.data.map(p => p.id),
      source: detailView ? "detail_page" : "list_page",
      deeplink: option.deeplink
    });

    window.open(androidUrl, '_blank', 'noopener,noreferrer');
    return;
  };


  const handleDivClick = (option: any) => {
    const priceDiff = option.mrp - option.offer_price;
    const discountPercent = ((priceDiff / option.mrp) * 100).toFixed(1);

    trackEvent("Outbound Link Click", geolocation, {
      // Identifiers
      product_id: option.id,
      variant_id: option.id,
      platform_id: option.platform.storeId,
      product_name: productName,
      product_brand: productBrand,
      
      // Product Details
      product_quantity: option.quantity,
      image_url: image,
      
      // Platform Details
      platform: option.platform.name,
      platform_icon: option.platform.icon,
      delivery_time: option.platform.sla,
      
      // Pricing Details
      price: option.offer_price,
      mrp: option.mrp,
      price_difference: priceDiff,
      discount_percentage: Number(discountPercent),
      has_discount: option.mrp !== option.offer_price,
      
      // Availability Details
      available: option.available,
      total_variants: product.data.length,
      is_cheapest: option.offer_price === Math.min(...product.data.map(p => p.offer_price)),
      all_variant_ids: product.data.map(p => p.id),
      
      // Source Details
      source: detailView ? "detail_page" : "list_page",
      deeplink: option.deeplink
    });

    const isAndroid = /Android/i.test(navigator.userAgent);

    if (option.platform.name === "Swiggy" && isAndroid) {
      affinityHandling(option);
      return
    }


    // Add UTM parameters
    const url = new URL(option.deeplink);
    if (option.platform.name !== "FirstClub") {
      url.searchParams.append('utm_source', 'qc');
      url.searchParams.append('utm_medium', 'web');
      url.searchParams.append('utm_campaign', 'price_compare');
      url.searchParams.append('utm_content', `${detailView ? 'detail' : 'list'}_${option.available ? 'instock' : 'oos'}`);
      url.searchParams.append('utm_term', productName?.toLowerCase().replace(/\s+/g, '_'));
    }

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  // Track impression when component mounts
  useEffect(() => {
    trackEvent("Product Impression", geolocation, {
      // Identifiers
      product_id: product.data[0]?.id,
      product_name: productName,
      product_brand: productBrand,
      
      // Display Details
      image_url: image,
      view_type: detailView ? "detail_page" : "list_page",
      
      // Platform & Variant Details
      platforms: product.data.map(p => ({
        id: p.platform.storeId,
        name: p.platform.name
      })),
      variant_ids: product.data.map(p => p.id),
      total_variants: product.data.length,
      
      // Pricing & Availability
      min_price: Math.min(...product.data.map(p => p.offer_price)),
      max_price: Math.max(...product.data.map(p => p.offer_price)),
      available_count: product.data.filter(p => p.available).length,
      has_discounts: product.data.some(p => p.mrp !== p.offer_price),
      max_discount: Math.max(...product.data.map(p => 
        ((p.mrp - p.offer_price) / p.mrp * 100)
      )).toFixed(1)
    });
  }, [detailView, geolocation, image, product.data, productBrand, productName]);

  return (
    <div className="flex flex-col gap-2 rounded-md bg-grey-light dark:bg-grey-dark px-2 py-0 shadow hover:shadow-md dark:shadow-none">
      <div className="relative">
        {detailView === false ? (
          <>
            <img
              className="h-24 w-full gap-2 bg-transparent object-contain"
              src={image}
              alt=""
              onClick={openProductDetailPage}
            />
            <div className="absolute bottom-0 right-0">
              <CartQuantityControl product={product} />
            </div>
          </>
        ) : null}
      </div>
      <div className="flex grow flex-col">
        {detailView ? (
          // Detail view - show individual brand/name for each platform inside cards
          <div className="flex flex-col gap-2 mb-2">
            {product.data.map((option, index) => (
              <div
                key={option.id || index}
                className={`rounded-xl ${detailView ? 'bg-grey-light dark:bg-bg' : 'bg-grey-light dark:bg-bg'} shadow-[0_2px_8px_0_rgba(60,72,88,0.10)] px-2 cursor-pointer transition-transform hover:shadow-lg hover:scale-[1.01] active:scale-95 drop-shadow-md ${
                  !option.available ? 'opacity-40' : ''
                }`}
                onClick={() => handleDivClick(option)}
              >
                {/* Brand and Name Header */}
                <div className="mb-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-normal text-text-light-dark">
                        {option.brand}
                      </div>
                      <div className="text-sm font-bold text-text-dark line-clamp-2">
                        {option.name}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Track the open in app click
                        trackEvent("Open in App Clicked", geolocation, {
                          platform: option.platform.name,
                          product_name: option.name,
                          product_brand: option.brand,
                          deeplink: option.deeplink
                        });
                        // Open the deeplink
                        window.open(option.deeplink, '_blank', 'noopener,noreferrer');
                      }}
                      className="ml-2 flex-shrink-0 p-1 rounded-full hover:bg-grey-light dark:hover:bg-grey-dark transition-colors"
                      title={`Open ${option.platform.name} app`}
                    >
                      <IconExternalLink size={16} className="text-text-light-dark dark:text-text-light" />
                    </button>
                  </div>
                </div>
                
                {/* Platform Info */}
                <div className="flex w-full items-center justify-between">
                  <img className="h-5 rounded" src={option.platform.icon} alt="" />
                  <div className="text-m font-semibold text-text-dark">
                    <span className="inline-flex items-baseline gap-2 border-b-1 border-[#E0E0E0] dark:border-gray-600 pb-0.5">
                      {option.mrp !== option.offer_price && (
                        <span className="text-xs font-normal text-text-light-dark line-through">
                          ₹{option.mrp}
                        </span>
                      )}
                      <span className="text-m font-bold text-text-dark">
                        ₹{option.offer_price}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pb-0.5">
                  <div className="text-sm text-text-light-dark">{option.quantity}</div>
                  <div className="flex items-center gap-2">
                    {option.available ? (
                      <>
                        {option.platform.sla ? (
                          <div className="flex flex-row items-center gap-1">
                            <IconClock size={12} stroke={2} className="text-text-light-dark" />
                            <span className="text-xs text-text-light-dark">{option.platform.sla}</span>
                          </div>
                        ) : (
                          <span className="rounded bg-red px-2 py-1 text-3xs font-bold text-bg">
                            Closed
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="rounded bg-text px-2 py-0.5 text-3xs font-bold text-bg">
                        Out Of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view - show shared brand/name
          <>
            <div className="w-full py-2" onClick={openProductDetailPage}>
              <div className="line-clamp-1 text-start text-xs font-normal text-text-light-dark">
                {productBrand}
              </div>
              <div
                key={"y" + productName}
                className="line-clamp-2 text-start text-sm font-bold text-text-dark">
                {productName}
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              {product.data.map((option, index) => (
                <div
                  key={option.id || index}
                  className={`rounded-xl ${detailView ? 'bg-grey-light dark:bg-bg' : 'bg-grey-light dark:bg-bg'} shadow-[0_2px_8px_0_rgba(60,72,88,0.10)] px-2 cursor-pointer transition-transform hover:shadow-lg hover:scale-[1.01] active:scale-95 drop-shadow-md ${
                    !option.available ? 'opacity-40' : ''
                  }`}
                  onClick={() => handleDivClick(option)}
                >
                  <div className="flex w-full items-center justify-between">
                    <img className="h-5 rounded" src={option.platform.icon} alt="" />
                    <div className="text-m font-semibold text-text-dark">
                      <span className="inline-flex items-baseline gap-2 border-b-1 border-[#E0E0E0] dark:border-gray-600 pb-0.5">
                        {option.mrp !== option.offer_price && (
                          <span className="text-xs font-normal text-text-light-dark line-through">
                            ₹{option.mrp}
                          </span>
                        )}
                        <span className="text-m font-bold text-text-dark">
                          ₹{option.offer_price}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pb-0.5">
                    <div className="text-sm text-text-light-dark">{option.quantity}</div>
                    <div className="flex items-center gap-2">
                      {option.available ? (
                        <>
                          {option.platform.sla ? (
                            <div className="flex flex-row items-center gap-1">
                              <IconClock size={12} stroke={2} className="text-text-light-dark" />
                              <span className="text-xs text-text-light-dark">{option.platform.sla}</span>
                            </div>
                          ) : (
                            // <span className="rounded bg-red px-2 py-1 text-3xs font-bold text-bg">
                            //   Closed
                            // </span>
                            null
                          )}
                        </>
                      ) : (
                        <span className="rounded bg-text px-2 py-0.5 text-3xs font-bold text-bg">
                          Out Of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupedProductListItem;
