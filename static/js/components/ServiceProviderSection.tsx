import React, { memo, useEffect, useRef, useState } from "react";
import { Eta, MarketplaceDetailsResponse } from "../api/getMarketplaceDetails";
// import { IconClock } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { trackEvent } from "../utils/analytics.ts";
import { useGeolocation } from "../context/GeolocationContext.tsx";
const DEVICE_IDENTIFIER_KEY = 'device_identifier';

const ServiceProviderSection = ({ eta }: { eta: MarketplaceDetailsResponse["eta"] }) => {
  const { geolocation } = useGeolocation();

  if (!eta?.length) {
    return <></>;
  }

  const affinityHandling = (item: Eta) => {
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

      trackEvent("AffinitySwiggyHome", geolocation, {
        cid: cid,
        subid: subid,
        click_url: androidUrl,
      });

      window.open(androidUrl, '_blank', 'noopener,noreferrer');
      return;
  }
  

  const handleDivClick = (item: Eta) => {
    // Open a new webview or tab with the specified URL
    // Check if Android device
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (item.platform === "Swiggy" && isAndroid) {
      affinityHandling(item);
      return
    }

    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  const EtaLabel = ({ text }: { text: string }) => {
    const pRef = useRef<HTMLParagraphElement | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
      const checkOverflow = () => {
        if (!pRef.current) return;
        const el = pRef.current;
        const overflowing = el.scrollWidth > el.clientWidth;
        setIsOverflowing(overflowing);
      };

      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }, []);

    return (
      <p
        ref={pRef}
        className={twMerge(
          "text-text-dark font-semibold text-center leading-tight truncate",
          isOverflowing ? "text-[8px]" : "text-xs"
        )}
      >
        {text}
      </p>
    );
  };


  return (
    <div className="bg-white dark:bg-grey-dark py-2 rounded-md shadow-pill dark:shadow-none mx-4">
      <div className="flex items-center gap-2 px-4">
        <h2 className="text-sm text-text-dark">Delivering in</h2>
      </div>
      <ul className="grid grid-cols-4 gap-2 px-4 py-2 md:grid-cols-none md:flex md:flex-wrap">
        {eta.map((item) => (
          <li
            key={item.platform}
            style={{ cursor: 'pointer'}} onClick={() => handleDivClick(item)}
            className={twMerge("flex flex-col justify-between rounded-md bg-grey-light dark:bg-bg shadow-pill dark:shadow-xl dark:shadow-black/30 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-200 overflow-hidden md:w-[72px] md:max-w-[72px]")}>            
            <div className="flex w-full items-center justify-center gap-1 py-1 bg-bg dark:bg-grey">
              {/* {item.open ?
              <IconClock size={14} stroke={2} className="text-text"/> : null} */}
              <EtaLabel text={item.eta ? item.eta : (item.open ? "N/A" : "Closed")} />
            </div>
            <img
              src={item.image}
              alt={item.platform}
              className="w-[80px] object-cover md:w-[72px]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(ServiceProviderSection);
