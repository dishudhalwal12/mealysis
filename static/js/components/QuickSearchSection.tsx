import React, { memo } from "react";
import { useNavigate } from "react-router";
import GradiantSeparator from "./GradiantSeparator.tsx";
import { IconTrash, IconX, IconSearch } from "@tabler/icons-react";
import { useConfirmationDialog } from "../context/ConfirmationDialogContext.tsx";
import { ProductSearchSuggestion } from "../api/getProductSearchSuggestions.ts";

const QuickSearchSection = ({
  sectionTitle,
  searches,
  handleClearRecent,
  handleRemoveItem,
}: {
  sectionTitle: string;
  searches?: ProductSearchSuggestion[];
  handleClearRecent?: () => void;
  handleRemoveItem?: (search: string) => void;
}) => {
  const navigate = useNavigate();
  const { showConfirmation } = useConfirmationDialog();

  if (!searches?.length) {
    return <></>;
  }

  const handleSearch = (search: ProductSearchSuggestion) => {
    navigate(`/search-results?q=${search.name}`);
  };

  const handleRemoveSearch = async (search: ProductSearchSuggestion) => {
    if (!handleRemoveItem) return;

    const confirmed = await showConfirmation({
      title: "Remove Search",
      text: `Are you sure you want to remove "${search.name}" from your recent searches?`,
      variant: "danger",
    });

    if (confirmed) {
      handleRemoveItem(search.name);
    }
  };

  return (
    <div className="overflow-visible">
      <div className="flex items-center gap-2 px-4">
        <h2 className="text-lg font-semibold text-text dark:text-white">{sectionTitle}</h2>
        <GradiantSeparator />
        <button
          onClick={handleClearRecent}
          className="hover:text-action-dark dark:hover:text-blue-400 flex items-center gap-1 text-sm font-medium text-action dark:text-blue-500">
          <IconTrash size={16} />
        </button>
      </div>
      <ul className="no-scrollbar flex gap-2 overflow-x-scroll px-4">
        {searches.map((search) => (
          <li key={search.name} className="relative group">
            <button
              onClick={() => handleSearch(search)}
              className="text-text-dark bg-grey-light dark:bg-grey-dark mb-6 mt-4 select-none whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-pill hover:shadow-lg transition-all duration-200 pr-8 relative flex items-center gap-2">
              {search.image ? (
                <img src={search.image} alt={search.name} className="h-5 w-5 rounded object-cover" />
              ) : (
                <IconSearch className="h-5 w-5 text-text-light-dark" />
              )}
              {search.name}
              {handleRemoveItem && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSearch(search);
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full p-1 opacity-80 hover:opacity-100 transition-all duration-200 z-10 border-gray-200 dark:border-gray-600">
                  <IconX size={12} />
                </button>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(QuickSearchSection);
