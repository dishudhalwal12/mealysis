import React, { createContext, useContext, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGeolocation } from "./GeolocationContext.tsx";
import getMarketplaceDetails, { MarketplaceDetailsResponse } from "../api/getMarketplaceDetails.ts";

interface MarketplaceContextType {
  marketplaceDetails: MarketplaceDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetchMarketplaceDetails: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { geolocation } = useGeolocation();
  const [error, setError] = useState<Error | null>(null);

  const {
    data: marketplaceDetails,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "marketplaceDetails",
      geolocation?.latitude ?? "",
      geolocation?.longitude ?? ""
    ],
    queryFn: () => {
      if (!geolocation) {
        setError(new Error("Geolocation not available"));
        return Promise.reject(new Error("Geolocation not available"));
      }
      return getMarketplaceDetails(geolocation.latitude, geolocation.longitude);
    },
    enabled: !!geolocation,
  });

  const refetchMarketplaceDetails = useCallback(async () => {
    try {
      await refetch();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [refetch]);

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceDetails: marketplaceDetails || null,
        isLoading,
        error,
        refetchMarketplaceDetails,
      }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

export default MarketplaceProvider;
