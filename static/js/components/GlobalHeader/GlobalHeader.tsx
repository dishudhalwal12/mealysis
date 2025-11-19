import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import AutoSuggestList from "./AutoSuggestList.tsx";
import throttle from "lodash.throttle";
import { useGeolocation } from "../../context/GeolocationContext.tsx";
import { IconChevronDown, IconSearch, IconShoppingCart, IconSun, IconMoon } from "@tabler/icons-react";
import getProductSearchSuggestions, {
  ProductSearchSuggestion,
} from "../../api/getProductSearchSuggestions.ts";
import { twMerge } from "tailwind-merge";
import BackButton from "../BackButton.tsx";
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext.tsx";
import { trackEvent } from '../../utils/analytics.ts';
import { useCart } from "../../context/CartContext.tsx";
import { useTheme } from "../../context/ThemeContext.tsx";

const getRecentSearchesAsSuggestions = (): ProductSearchSuggestion[] => {
  try {
    const stored = localStorage.getItem("recentSearches");
    if (!stored) return [];

    const parsedSearches = JSON.parse(stored);
    if (!Array.isArray(parsedSearches)) return [];

    // Handle both old format (strings) and new format (objects)
    return parsedSearches.reverse().map((item) => {
      if (typeof item === 'string') {
        return { name: item, subtitle: "Recent search", image: "" };
      } else {
        return { name: item.name, subtitle: "Recent search", image: item.image || "" };
      }
    });
  } catch (error) {
    console.error("Error parsing recent searches:", error);
    return [];
  }
};

const GlobalHeader = () => {
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();
  const { geolocation } = useGeolocation();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  
  // Debug logging for cart count
  console.log('GlobalHeader - totalItems:', totalItems);
  
  const storedRecentSearches = localStorage.getItem("recentSearches") || "[]";

  const [query, setQuery] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);

  const [recentSuggestions, setRecentSuggestions] = useState<ProductSearchSuggestion[]>(
    getRecentSearchesAsSuggestions(),
  );
  const [suggestions, setSuggestions] = useState<ProductSearchSuggestion[]>(recentSuggestions);

  const { showConfirmation } = useConfirmationDialog();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!headerContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setHeaderHeight(entries[0].borderBoxSize[0].blockSize);
    });
    observer.observe(headerContainerRef.current);
  }, [headerContainerRef]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledFetchSuggestions = useCallback(
    throttle(async (value: string) => {
      if (value.length > 0) {
        try {
          const data = await getProductSearchSuggestions(geolocation, value);
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions(recentSuggestions);
      }
    }, 1000),
    [geolocation],
  );

  useEffect(() => {
    if (!location.state?.query) {
      return;
    }

    setQuery(location.state.query);

    if (location.pathname === "/search") {
      setSuggestions(recentSuggestions);
      throttledFetchSuggestions(location.state.query);
    }
  }, [location, recentSuggestions, throttledFetchSuggestions]);

  const handleInputChange = useCallback(
    (e) => {
      if (!e.target?.value) {
        setSuggestions(recentSuggestions);
      }

      if (e.target.value?.length >= 1 && geolocation) {
        throttledFetchSuggestions(e.target.value);
      }

      setQuery(e.target?.value);
    },
    [geolocation, recentSuggestions, throttledFetchSuggestions],
  );

  const triggerSearch = useCallback(
    (query: string, suggestion?: ProductSearchSuggestion) => {
      try {
        const parsed = JSON.parse(storedRecentSearches);
        if (!Array.isArray(parsed)) return;
        
        // Handle both old format (strings) and new format (objects)
        const recentSearches = parsed.map((item: any) => {
          if (typeof item === 'string') {
            return { name: item, subtitle: "Recent search", image: "" };
          } else {
            return { name: item.name, subtitle: "Recent search", image: item.image || "" };
          }
        });
        
        const searchObject = suggestion || { name: query, subtitle: "", image: "" };
        
        if (query && !recentSearches.some(search => search.name === query)) {
          recentSearches.push(searchObject);
          if (recentSearches.length > 7) recentSearches.shift();
          localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
          
          trackEvent("Search Added to Recent", geolocation, {
            query,
            total_recent_searches: recentSearches.length
          });
        }
        setSuggestions(recentSearches);
        
        trackEvent("Search Performed", geolocation, {
          query,
          source: "search_bar",
          is_recent_search: recentSearches.some(search => search.name === query)
        });
        
        navigate(`/search-results?q=${query}`, { replace: true });
      } catch (error) {
        console.error("Error handling search:", error);
        navigate(`/search-results?q=${query}`, { replace: true });
      }
    },
    [navigate, storedRecentSearches, geolocation]
  );

  const handleSearchButtonClick = useCallback(() => {
    if (window.location.pathname === "search") return;
    navigate("/search", { state: { query } });
  }, [navigate, query]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSuggestions(recentSuggestions);
      triggerSearch(query);
    },
    [query, recentSuggestions, triggerSearch],
  );

  const handleSuggestionClick = useCallback(
    (query: string, suggestion?: ProductSearchSuggestion) => {
      trackEvent("Search Suggestion Clicked", geolocation, {
        query,
        is_recent_suggestion: recentSuggestions.some(s => s.name === query)
      });

      setQuery(query);
      setSuggestions(recentSuggestions);
      triggerSearch(query, suggestion);
    },
    [recentSuggestions, triggerSearch, geolocation]
  );

  const handleLocationClick = useCallback(() => {
    navigate("/geolocation");
  }, [navigate]);

  const handleClearRecent = useCallback(async () => {
    const confirmed = await showConfirmation({
      title: "Clear Recent Searches",
      text: "Are you sure you want to clear all recent searches?"
    });
    
    if (confirmed) {
      trackEvent("Clear Recent Searches", geolocation, {
        total_searches_cleared: recentSuggestions.length
      });

      localStorage.setItem("recentSearches", "[]");
      setSuggestions([]);
      setRecentSuggestions([]);
    }
  }, [showConfirmation, recentSuggestions.length, geolocation]);

  const handleCartClick = useCallback(() => {
    trackEvent("Cart Icon Clicked", geolocation, {
      total_items: totalItems,
      source: "header"
    });
    navigate("/cart-comparison");
  }, [navigate, totalItems, geolocation]);

  return (
    <>
      <div className="fixed z-50 mx-auto w-full max-w-[800px] rounded-b-2xl shadow dark:shadow-none transition-colors duration-200 bg-white dark:bg-bg">
        <div className={twMerge("flex w-full flex-col items-center")}>
          <div className="flex w-full flex-col py-4" ref={headerContainerRef}>
            <div className="flex items-center justify-between px-4">
              <button onClick={handleLocationClick} className="flex flex-col min-w-0 flex-1 mr-4">
                <div className="justify-left flex items-center text-left text-sm text-text-light-dark">
                  Delivering to
                  <IconChevronDown className="ml-1 h-4 w-4 flex-shrink-0" />
                </div>
                <div className="justify-left text-m flex w-full items-center gap-2 text-left font-bold text-gray-900 dark:text-white">
                  <div className="truncate">{geolocation ? geolocation.name : "Select Location"}</div>
                </div>
              </button>
              
              <div className="flex items-center gap-2">
                {/* Theme Switch Button */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors flex-shrink-0"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <IconMoon size={18} className="text-gray-700 dark:text-gray-300" />
                  ) : (
                    <IconSun size={18} className="text-yellow-500" />
                  )}
                </button>
                
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
            {location.pathname !== "/geolocation" && (
              <div className="mt-2 flex w-full">
                <BackButton />
                <form className="relative grow pr-4" onSubmit={handleSubmit}>
                  <IconSearch className="text-slate-950 dark:text-gray-300 absolute left-2.5 top-[13px] h-4 w-4 text-bg-dark dark:text-white" />
                  <input
                    type="search"
                    autoFocus={location.pathname === "/search"}
                    value={query}
                    onClick={handleSearchButtonClick}
                    onChange={handleInputChange}
                    className="w-full cursor-pointer rounded-xl border border-action dark:border-transparent bg-grey-light dark:bg-grey-dark p-2 ps-8 focus:cursor-auto focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Search to compare prices, availability"
                  />
                </form>
              </div>
            )}
          </div>
          {location.pathname === "/search" ? (
            <AutoSuggestList
              query={query}
              suggestions={suggestions}
              onClick={handleSuggestionClick}
              headerHeight={headerHeight + 2}>
              {recentSuggestions.length > 0 && !query && (
                <li className="mt-2 flex justify-center px-1 py-2">
                  <button
                    onClick={handleClearRecent}
                    className="hover:text-action-dark text-sm font-medium text-action">
                    Clear recent searches
                  </button>
                </li>
              )}
            </AutoSuggestList>
          ) : null}
        </div>
        {/* Subtle Separator */}
        <div className="h-0.5 w-full dark:bg-"></div>
      </div>
    </>
  );
};

export default GlobalHeader;
