import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useGeolocation } from "../context/GeolocationContext.tsx";
import Loader from "../components/Loader.tsx";
import GeolocationNotAvailable from "../components/GeolocationNotAvailable.tsx";
import QuickSearchSection from "../components/QuickSearchSection.tsx";
import ServiceProviderSection from "../components/ServiceProviderSection.tsx";
import GlobalHeader from "../components/GlobalHeader/GlobalHeader.tsx";
import "../styles/globals.css";
import { Footer, LogoFooter } from "../components/Footer/Footer.tsx";
import BannerCarousel from "../components/BannerCarousel/BannerCarousel.tsx";
import TrendingSearchSection from "../components/TrendingSearchSection.tsx";
import { useConfirmationDialog } from "../context/ConfirmationDialogContext.tsx";
import { isAppBrowser } from "../utils/platform.ts";
import { useMarketplace } from "../context/MarketplaceContext.tsx";
import { trackEvent } from "../utils/analytics.ts";
import { ProductSearchSuggestion } from "../api/getProductSearchSuggestions.ts";


const HomePage = () => {
  const { geolocation, isLocating } = useGeolocation();
  const { marketplaceDetails, isLoading } = useMarketplace();
  const storedRecentSearches = localStorage.getItem("recentSearches") || "[]";
  const { showConfirmation } = useConfirmationDialog();
  const [recentSearches, setRecentSearches] = useState<ProductSearchSuggestion[]>(() => {
    try {
      const parsed = JSON.parse(storedRecentSearches);
      if (Array.isArray(parsed)) {
        // Handle both old format (strings) and new format (objects)
        return parsed.map(item => {
          if (typeof item === 'string') {
            return { name: item, subtitle: "Recent search", image: "" };
          } else {
            return { name: item.name, subtitle: "Recent search", image: item.image || "" };
          }
        }).reverse();
      }
      return [];
    } catch (error) {
      console.error("Error parsing recent searches:", error);
      return [];
    }
  });

  // Track page view
  useEffect(() => {
    trackEvent("Page View", geolocation, {
      page: "Home",
      has_recent_searches: recentSearches.length > 0,
      recent_searches_count: recentSearches.length
    });
  }, [geolocation, recentSearches.length]);

  // Track location access
  // (Removed useEffect that called locateMe)

  const banners = useMemo(() => [] as Array<{
    imageUrl: string;
    clickUrl?: string;
    isClickable?: boolean;
  }>, []);

  const handleClearRecent = useCallback(async () => {
    const confirmed = await showConfirmation({
      title: "Clear Recent Searches",
      text: "Are you sure you want to clear all recent searches?",
    });

    if (confirmed) {
      trackEvent("Clear Recent Searches", geolocation, {
        total_searches_cleared: recentSearches.length,
        oldest_search: recentSearches[recentSearches.length - 1]?.name,
        newest_search: recentSearches[0]?.name
      });

      localStorage.setItem("recentSearches", "[]");
      setRecentSearches([]);
    }
  }, [showConfirmation, recentSearches, geolocation]);

  const handleRemoveItem = useCallback((searchToRemove: string) => {
    trackEvent("Remove Recent Search", geolocation, {
      removed_search: searchToRemove,
      remaining_searches: recentSearches.length - 1
    });

    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Remove the item by name, keeping the object structure
          const updatedSearches = parsed.filter((item: any) => {
            const name = typeof item === 'string' ? item : item.name;
            return name !== searchToRemove;
          });
          localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
          
          // Update the state with full objects
          const updatedObjects = updatedSearches.map((item: any) => {
            if (typeof item === 'string') {
              return { name: item, subtitle: "Recent search", image: "" };
            } else {
              return { name: item.name, subtitle: "Recent search", image: item.image || "" };
            }
          }).reverse();
          setRecentSearches(updatedObjects);
        }
      }
    } catch (error) {
      console.error("Error removing recent search:", error);
    }
  }, [recentSearches.length, geolocation]);

  const handleBannerView = useCallback((index: number) => {
    if (banners.length > 0 && banners[index]) {
      trackEvent("Banner View", geolocation, {
        banner_url: banners[index].imageUrl,
        banner_position: index + 1,
        total_banners: banners.length
      });
    }
  }, [banners, geolocation]);

  return (
    <>
      <GlobalHeader />
      <div className="relative z-0 mt-32 transition-colors duration-200">
        {isLoading || isLocating ? (
          <Loader variant="default" />
        ) : !geolocation ? (
          <GeolocationNotAvailable />
        ) : marketplaceDetails ? (
          <>
            <div>
              <div className="py-2"></div>
              <ServiceProviderSection eta={marketplaceDetails.eta} />
              <div className="py-2"></div>
              {banners.length > 0 && (
                <>
                  <div className="relative overflow-visible">
                    <BannerCarousel 
                      banners={banners} 
                      autoPlayInterval={20000} 
                      onSlideChange={handleBannerView}
                    />
                  </div>
                  <div className="py-2"></div>
                </>
              )}
              <QuickSearchSection
                sectionTitle="Recent Search"
                searches={recentSearches}
                handleClearRecent={handleClearRecent}
                handleRemoveItem={handleRemoveItem}
              />
              <TrendingSearchSection
                sectionTitle="Trending Items"
                searches={marketplaceDetails.trendingItems}
              />
            </div>
            <div className="h-4 px-4" />
            {!isAppBrowser ? <Footer /> : <LogoFooter />}
            {!isAppBrowser ? <div className="h-32"></div> : <div className="h-32"></div>}
          </>
        ) : (
          <></>
        )}
      </div>
      {/* {!loading && !isLocating &&
        <FeedbackWidget />
      } */}
    </>
  );
};

export default HomePage;
