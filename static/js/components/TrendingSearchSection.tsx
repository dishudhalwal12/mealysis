import React, { memo } from "react";
import { useNavigate } from "react-router";
import { TrendingItems } from "../api/getMarketplaceDetails";
import GradiantSeparator from "./GradiantSeparator.tsx";

interface ProductSearchProps {
  name: string;
  imageUrl: string;
}

const ProductCard = ({ name, imageUrl }: ProductSearchProps) => (
  <div className="w-20 h-24 relative">
    <div className="w-full h-full absolute inset-0">
      <div className="w-full h-20 absolute inset-0 bg-grey-light dark:bg-grey-dark rounded-xl shadow-sm hover:shadow-lg transition-all" />
      <div className="w-full absolute bottom-0 text-center text-text-dark text-xs font-semibold leading-tight truncate px-2">
        {name}
      </div>
    </div>
    <img 
      className="w-16 h-16 absolute left-1/2 top-2.5 -translate-x-1/2 object-contain" 
      src={imageUrl} 
      alt={name}
    />
  </div>
);

const TrendingSearchSection = ({
  sectionTitle,
  searches,
}: {
  sectionTitle: string;
  searches?: TrendingItems[];
}) => {
  const navigate = useNavigate();

  if (!searches?.length) {
    return null;
  }

  const handleSearch = (item: TrendingItems) => {
    navigate(`/search-results?q=${item.name}`);
  };

  return (
    <div className="overflow-visible">
      <div className="flex items-center gap-2 px-4">
        <h2 className="text-lg text-text dark:text-white font-semibold">{sectionTitle}</h2>
        <GradiantSeparator />
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-scroll px-4 py-4">
        {searches.map((item) => (
          <button
            key={item.name}
            onClick={() => handleSearch(item)}
            className="select-none focus:outline-none active:scale-95 transition-transform"
          >
            <ProductCard 
              name={item.name} 
              imageUrl={item.image} // Replace with actual image URL
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(TrendingSearchSection);
