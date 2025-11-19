import React, { useState, useEffect } from "react";
import GlobalHeader from "../components/GlobalHeader/GlobalHeader.tsx";
import GoogleAdBanner from "../components/GoogleAdBanner.tsx"; // Assuming you want to add this
import { useLocation } from "react-router";

export default function SearchPage() {
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading time, replace with actual data fetching logic
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000); // Adjust this duration as needed

    return () => clearTimeout(timer);
  }, [location.search]); // Re-run effect when search query changes

  return (
    <div className="flex h-full flex-col">
      <GlobalHeader />
      <div className="flex grow flex-col items-center justify-center p-4">
        {showContent ? (
          <>
            {/* Your actual search results or content will go here */}
            <p>Search results will appear here!</p>
            <GoogleAdBanner 
              key="/23312116132/quickcompare_web/qc_search_page"
              adSlot="/23312116132/quickcompare_web/qc_search_page" 
              adFormat="auto"
              className="mt-4 w-full"
            />
          </>
        ) : (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex h-60 max-w-96 items-center justify-center">
              <img
                src={"https://i.pinimg.com/736x/4c/d3/8e/4cd38e5d59ced5285a4889c8fd54fce9.jpg"}
                alt="placeholder"
              />
            </div>
            <p className="text-text-light-dark dark:text-gray-400">Loading amazing deals...</p>
            <GoogleAdBanner 
              key="/23312116132/quickcompare_web/qc_home"
              adSlot="/23312116132/quickcompare_web/qc_home" 
              adFormat="auto"
              className="mt-4 w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
