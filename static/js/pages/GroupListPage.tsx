import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import GroupListItem from "../components/GroupListItem.tsx";
import { useGeolocation } from "../context/GeolocationContext.tsx";
import { useMarketplace } from "../context/MarketplaceContext.tsx";
import GlobalHeader from "../components/GlobalHeader/GlobalHeader.tsx";
import getGroupedProducts, { GroupedProduct } from "../api/getGroupedProducts.ts";
import Loader from "../components/Loader.tsx";
import mixpanel from '../services/mixpanel.ts';
import GoogleAdBanner from "../components/GoogleAdBanner.tsx";
import { isAppBrowser } from "../utils/platform.ts";

const FILTER_PREFERENCES_KEY = 'platformFilterPreferences';

export default function GroupListPage() {
  const [searchParams] = useSearchParams();
  const { locateMe, geolocation, isLocating } = useGeolocation();
  const { marketplaceDetails } = useMarketplace();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  
  var query = searchParams.get("q") || "";
  var text = searchParams.get("text") || "";
  var url = searchParams.get("url") || "";
  if (query.length === 0) {
    if (text.length > 0) {
      text = removeUrls(text);

      if (text.includes("Check out this product on Zepto!")) {
        text = text.replace("Check out this product on Zepto!", "");
      } else if (text.includes("Check out this product on blinkit-")) {
        text = text.replace("Check out this product on blinkit-", "");
      } else if (text.includes("on Swiggy Instamart:")) {
        text = text.replace("on Swiggy Instamart:", "");
        text = text.replace("Check out ", "");
      } else if (text.includes("on Flipkart")) {
        text = text.replace("on Flipkart", "");
        text = text.replace("Take a look at this ", "");
      }
      text = text.trim();
      query = text;
    } else if (url.length > 0) {
      query = url;
    }
  }

  // Load saved filter preferences only once on mount
  useEffect(() => {
    if (!preferencesLoaded) {
      try {
        const savedPreferences = localStorage.getItem(FILTER_PREFERENCES_KEY);
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          setSelectedPlatforms(preferences);
        }
        setPreferencesLoaded(true);
      } catch (error) {
        console.error('Error loading filter preferences:', error);
        setPreferencesLoaded(true);
      }
    }
  }, [preferencesLoaded]);

  // Save filter preferences whenever they change
  useEffect(() => {
    if (preferencesLoaded) {
      try {
        localStorage.setItem(FILTER_PREFERENCES_KEY, JSON.stringify(selectedPlatforms));
      } catch (error) {
        console.error('Error saving filter preferences:', error);
      }
    }
  }, [selectedPlatforms, preferencesLoaded]);

  useEffect(() => {
    if (!geolocation) {
      locateMe().catch(() => {});
    }
  }, [geolocation, locateMe]);

  useEffect(() => {
    // Track page view
    mixpanel.track("Page View", {
      page: "Group List",
      query,
      text,
      url,
      timestamp: new Date().toISOString(),
      location: geolocation?.name,
      latitude: geolocation?.latitude,
      longitude: geolocation?.longitude
    });
  }, [query, text, url, geolocation]);

  const { data: products = [], isLoading, error } = useQuery<GroupedProduct[]>({
    queryKey: ["groupedProducts", geolocation, query, marketplaceDetails],
    queryFn: () => {
      // Track search query
      mixpanel.track("Product Search", {
        query,
        source: text ? "shared_text" : url ? "shared_url" : "direct_search",
        timestamp: new Date().toISOString(),
        location: geolocation?.name,
        latitude: geolocation?.latitude,
        longitude: geolocation?.longitude
      });
      return getGroupedProducts(geolocation, query, marketplaceDetails);
    },
    enabled: !!geolocation,
    select: (data) => data.sort((a, b) => b.data.length - a.data.length),
    staleTime: 5 * 60 * 1000, // 5 minutes,
    gcTime: 5 * 60 * 1000, // 5 minutes,
  });

  // Extract unique platforms from products
  const availablePlatforms = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const platformMap = new Map<string, string>();
    products.forEach(product => {
      if (product.data && Array.isArray(product.data)) {
        product.data.forEach(item => {
          if (item.platform && item.platform.name && item.platform.icon) {
            platformMap.set(item.platform.name, item.platform.icon);
          }
        });
      }
    });
    return Array.from(platformMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  // Get all platforms including previously hidden ones
  const allPlatforms = useMemo(() => {
    const currentPlatforms = new Map(availablePlatforms);
    
    // Get previously hidden platforms from localStorage
    try {
      const savedPreferences = localStorage.getItem(FILTER_PREFERENCES_KEY);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        preferences.forEach((platformName: string) => {
          if (!currentPlatforms.has(platformName)) {
            // Add placeholder for platforms not in current results
            currentPlatforms.set(platformName, '');
          }
        });
      }
    } catch (error) {
      console.error('Error loading saved preferences:', error);
    }
    
    return Array.from(currentPlatforms.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [availablePlatforms]);

  // Filter products based on selected platforms
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (selectedPlatforms.length === 0) {
      return products;
    }
    
    return products.map(product => ({
      ...product,
      data: product.data.filter(item => 
        item.platform && item.platform.name && !selectedPlatforms.includes(item.platform.name)
      )
    })).filter(product => product.data && product.data.length > 0);
  }, [products, selectedPlatforms]);

  const handlePlatformToggle = (platformName: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformName)) {
        return prev.filter(p => p !== platformName);
      } else {
        return [...prev, platformName];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedPlatforms([]);
    try {
      localStorage.removeItem(FILTER_PREFERENCES_KEY);
    } catch (error) {
      console.error('Error clearing filter preferences:', error);
    }
  };

  const handleLocationChange = () => {
    // Track location change click
    mixpanel.track("Location Change Click", {
      page: "Group List",
      query,
      timestamp: new Date().toISOString(),
      current_location: geolocation?.name,
      latitude: geolocation?.latitude,
      longitude: geolocation?.longitude
    });
  };

  // Show error state
  if (error) {
    return (
      <>
        <GlobalHeader />
        <div className="mt-36 overflow-y-scroll transition-colors duration-200">
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Error loading products</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Please try again or{" "}
              <Link 
                to="/geolocation" 
                className="text-blue-500 dark:text-blue-400 underline"
                onClick={handleLocationChange}
              >
                change your location
              </Link>
              .
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalHeader />
      <div className="mt-32 transition-colors duration-200">
        <div className="h-[calc(100vh-50px)] overflow-y-auto">
          {isLoading || isLocating ? (
            <Loader variant="lottie-webp" />
          ) : products && products.length > 0 ? (
            <>
              {/* Platform Filters */}
              {availablePlatforms.length > 1 && (
                <div className="px-4 py-2 shadow-sm bg-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-text-dark dark:text-text-light">Filter by platforms</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-light-dark dark:text-text-light">
                        {selectedPlatforms.length === 0 
                          ? `${products.reduce((acc, product) => acc + product.data.length, 0)} products`
                          : selectedPlatforms.length === allPlatforms.length 
                            ? `0 products`
                            : `${filteredProducts.reduce((acc, product) => acc + product.data.length, 0)}/${products.reduce((acc, product) => acc + product.data.length, 0)} products`
                        }
                      </span>
                      {selectedPlatforms.length > 0 && (
                        <button
                          onClick={handleClearFilters}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        >
                          Show all
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-nowrap gap-2 overflow-x-scroll no-scrollbar">
                    {allPlatforms.map(([platformName, icon]) => {
                      const isAvailable = availablePlatforms.some(([name]) => name === platformName);
                      const isSelected = selectedPlatforms.includes(platformName);
                      
                      return (
                        <button
                          key={platformName}
                          onClick={() => isAvailable ? handlePlatformToggle(platformName) : null}
                          disabled={!isAvailable}
                          className={`flex items-center justify-center rounded transition-all duration-200 flex-shrink-0 ${
                            !isAvailable 
                              ? 'opacity-30 cursor-not-allowed bg-grey-light dark:bg-grey-dark'
                              : isSelected
                                ? 'border-gray-300 dark:border-gray-600 opacity-30 bg-grey-light dark:bg-grey-dark'
                                : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-bg'
                          }`}
                          title={!isAvailable 
                            ? `${platformName} - Not available in current search` 
                            : isSelected 
                              ? `Show ${platformName}` 
                              : `Hide ${platformName}`
                          }
                        >
                          <div className="w-14 flex items-center justify-center">
                            {icon ? (
                              <img src={icon} alt={platformName} className="w-full h-full object-contain rounded" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-text-light-dark dark:text-text-light">
                                {platformName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          {/* Cross button for selected state */}
                          {isAvailable && !isSelected && (
                            <div className="w-4 h-4 flex items-center justify-center text-text-dark dark:text-text-light">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-2 px-2 pb-8 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <GroupListItem key={index} product={product} detailView={false} />
                ))}
              </div>
              <div className="h-[100px]">
                  <GoogleAdBanner
                    adSlot="/23312116132/quickcompare_web/qc_home"
                    adFormat="auto"
                    className="w-full overflow-hidden h-full"
                    adSizes={[[300, 50]]}
                  />
              </div>
              
              {/* Bottom Spacing */}
              <div className="h-[200px]"></div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">No products found</h1>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {"Try searching for something else or "}
                <br />
                <Link 
                  to="/geolocation" 
                  className="text-blue-500 dark:text-blue-400 underline"
                  onClick={handleLocationChange}
                >
                  {"change your location"}
                </Link>
                {"."}
              </p>
              <GoogleAdBanner
                adSlot="/23312116132/quickcompare_web/qc_mpu"
                adFormat="auto"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Sticky Footer with Google Ad */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-transparent">
        <div className="flex items-center justify-center w-full h-full bg-transparent">
          <GoogleAdBanner
            adSlot="/23312116132/quickcompare_web/qc_scroll"
            adFormat="auto"
            className="h-full w-full"
            adSizes={[[300, 50], [320, 50]]}
          />
        </div>
      </div>
    </>
  );
}

function removeUrls(input: string): string {
  // Regular expression to match URLs
  const urlPattern = /https?:\/\/[^\s]+/g;

  // Replace all occurrences of URLs with an empty string
  return input.replace(urlPattern, "").trim();
}
