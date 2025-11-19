import React from "react";
import { IconClock, IconSearch } from "@tabler/icons-react";
import { ProductSearchSuggestion } from "../../api/getProductSearchSuggestions.ts";
import GradiantSeparator from "../GradiantSeparator.tsx";

const AutoSuggestList = ({
  query,
  suggestions,
  headerHeight,
  onClick,
  children,
}: {
  query: string;
  suggestions: ProductSearchSuggestion[];
  headerHeight: number;
  onClick: (query: string, suggestion?: ProductSearchSuggestion) => void;
  children?: React.ReactNode;
}) => {
  // Check if we're showing recent searches (no query and suggestions have subtitle "Recent search")
  const isShowingRecentSearches = !query && suggestions.length > 0 && suggestions.some(s => s.subtitle === "Recent search");
  
  return (
    <ul
      className="absolute z-20 w-full overflow-hidden bg-bg px-4"
      style={{
        top: headerHeight,
        height: `calc(100vh - ${headerHeight}px)`,
      }}>
      {/* Show "Recent Search" title when displaying recent searches */}
      {isShowingRecentSearches && (
        <li className="flex items-center gap-2 px-1 py-3">
          <h2 className="text-lg font-semibold text-text dark:text-white">Recent Search</h2>
        </li>
      )}
      {suggestions.map((suggestion: ProductSearchSuggestion) => (
        <li key={suggestion.name} className="flex flex-col gap-2">
          <button
            onClick={() => onClick(suggestion.name, suggestion)}
            className="flex w-full items-center justify-between bg-bg px-1 py-2 hover:bg-bg">
            <div className="flex items-center gap-2">
              {suggestion.image ? (
                <img src={suggestion.image} alt={suggestion.name} className="h-8 w-8 rounded" />
              ) : (
                <IconClock className="h-8 w-8 py-2 text-text-light-dark" />
              )}
              <p className="text-sm">{suggestion.name}</p>
            </div>
            <IconSearch className="text-gray-400 dark:text-gray-500 mr-2 h-5 w-5" />
          </button>
          <GradiantSeparator />
        </li>
      ))}
      {children}
      {query.length > 2 && (
        <li key="see-all" className="flex flex-col gap-2 px-1 py-2">
          <button
            onClick={() => onClick(query)}
            className="flex w-full items-center justify-between bg-bg px-1 py-2 hover:bg-bg">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-text dark:text-white">See All</p>
            </div>
          </button>
          <div className="h-[0.75px] grow bg-gradient-to-r from-bg-dark to-bg"></div>
        </li>
      )}
    </ul>
  );
};

export default AutoSuggestList;
