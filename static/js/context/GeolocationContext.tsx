import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import getPlaceDetailsByCoordinates from "../api/getPlaceDetailsByCoordinates.ts";
import { isAndroidApp } from "../utils/platform.ts";
import { useAlert } from "./AlertContext.tsx";

export interface GeolocationPrediction {
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: {
      length: number;
      offset: number;
    }[];
    secondary_text: string;
  };
  terms: { offset: number; value: string }[];
  types: string[];
}

export type Geolocation = {
  latitude: number;
  longitude: number;
  place_id: string;
  formatted_address: string;
  name: string;
  city: string;
  pincode: string;
} | null;

const GeolocationContext = createContext({
  geolocation: null as Geolocation,
  isLocating: false,
  locateMe: () => Promise.resolve(null) as Promise<Geolocation>,
  storeGeolocation: (_geolocation: Geolocation) => {},
  getNameFromAddressComponents: (_addressComponents: any[]) => "" as string,
  getCityFromAddressComponents: (_addressComponents: any[]) => "" as string,
  getPincodeFromAddressComponents: (_addressComponents: any[]) => "" as string,
  extractCityFromFormattedAddress: (_formattedAddress: string) => "" as string,
  extractPincodeFromFormattedAddress: (_formattedAddress: string) => "" as string,
});

const defaultGeolocation = {
  latitude: 12.9038,
  longitude: 77.6648,
  formatted_address: "Sobha Classic, Haralur, Bangalore, 560102, Karnataka",
  place_id: "xxx",
  name: "Sobha Classic, Haralur, Bangalore, 560102, Karnataka",
  city: "Bengaluru",
  pincode: "560103",
};

const errorMessageMap = {
  0: {
    title: "Location Not Found",
    message: "You can set your location manually by searching for your area.",
  },
  1: {
    title: "Location Access Denied",
    message: "No worries - you can still set your location manually by searching for your area.",
  },
  2: {
    title: "Location Error",
    message: "You can set your location manually by searching for your area.",
  },
  3: {
    title: "Location Timeout",
    message: "You can set your location manually by searching for your area.",
  },
};

export const getNameFromAddressComponents = (addressComponents: any[]) => {
  return addressComponents
    ?.splice(0, 2)
    ?.map((component) => component.long_name)
    ?.join(", ");
};

export const getCityFromAddressComponents = (addressComponents: any[]) => {
  const cityComponent = addressComponents?.find(
    (component) => component.types?.includes("city")
  );
  return cityComponent?.long_name || "";
};

export const getPincodeFromAddressComponents = (addressComponents: any[]) => {
  const pincodeComponent = addressComponents?.find(
    (component) => component.types?.includes("postal_code")
  );
  return pincodeComponent?.long_name || "";
};

export const extractCityFromFormattedAddress = (formattedAddress: string): string => {
  // Pattern: look for city name before the last comma and state
  const parts = formattedAddress.split(', ');
  if (parts.length >= 3) {
    // Try different positions for city, prioritizing the most likely ones
    
    // First, try the third-last part (common pattern: area, city, state)
    const thirdLastPart = parts[parts.length - 3];
    if (thirdLastPart && !thirdLastPart.match(/\b\d{6}\b/)) {
      return thirdLastPart;
    }
    
    // If third-last has pincode, try fourth-last
    if (parts.length >= 4) {
      const fourthLastPart = parts[parts.length - 4];
      if (fourthLastPart && !fourthLastPart.match(/\b\d{6}\b/)) {
        return fourthLastPart;
      }
    }
    
    // Try the second-last part (before state/country)
    if (parts.length >= 2) {
      const secondLastPart = parts[parts.length - 2];
      if (secondLastPart && !secondLastPart.match(/\b\d{6}\b/)) {
        return secondLastPart;
      }
    }
    
    // If still no city found, try the middle part (for addresses like: area, city, state pincode)
    if (parts.length >= 3) {
      const middlePart = parts[Math.floor(parts.length / 2)];
      if (middlePart && !middlePart.match(/\b\d{6}\b/)) {
        return middlePart;
      }
    }
    
    // Last resort: try all parts except the last one (which usually contains state+pincode)
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part && !part.match(/\b\d{6}\b/) && part.length > 0) {
        return part;
      }
    }
  }
  return "";
};

export const extractPincodeFromFormattedAddress = (formattedAddress: string): string => {
  // Pattern: look for 6-digit number (Indian pincode format)
  // Using a more robust regex that handles various formats and edge cases
  
  // First, try to find a standalone 6-digit number (most common case)
  let pincodeMatch = formattedAddress.match(/(?<!\d)\d{6}(?!\d)/);
  
  // If not found, try to find a 6-digit number that might be part of a larger string
  if (!pincodeMatch) {
    pincodeMatch = formattedAddress.match(/\b\d{6}\b/);
  }
  
  // If still not found, try to find any 6 consecutive digits
  if (!pincodeMatch) {
    pincodeMatch = formattedAddress.match(/\d{6}/);
  }
  
  const pincode = pincodeMatch ? pincodeMatch[0] : "";
  
  // Validate that it's a valid Indian pincode (should start with 1-9, not 0)
  if (pincode && pincode.length === 6 && pincode[0] !== '0') {
    return pincode;
  }
  
  return "";
};

const GeolocationProvider = ({ children }) => {
  // Handle old geolocation data that doesn't have city and pincode
  const processStoredGeolocation = (stored: string): Geolocation => {
    try {
      const parsed = JSON.parse(stored);
      
      // If it's an old format without city and pincode, extract them from formatted_address
      if (parsed && !parsed.city && !parsed.pincode && parsed.formatted_address) {
        return {
          ...parsed,
          city: extractCityFromFormattedAddress(parsed.formatted_address),
          pincode: extractPincodeFromFormattedAddress(parsed.formatted_address),
        };
      }
      
      return parsed;
    } catch (error) {
      console.error("Error parsing stored geolocation:", error);
      return null;
    }
  };

  const [geolocation, setGeolocation] = useState<Geolocation>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { showAlert } = useAlert();

  const storeGeolocation = useCallback((geolocation: Geolocation) => {
    setGeolocation(geolocation);
    localStorage.setItem("geolocation", JSON.stringify(geolocation));
    console.log('Stored geolocation in localStorage:', geolocation);
  }, []);

  const locateMe: () => Promise<Geolocation> = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsLocating(true);

      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by your browser");
        setIsLocating(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getPlaceDetailsByCoordinates(latitude, longitude);
            console.log("data", data);
            
            // Extract city and pincode from address components
            const addressComponents = data['location_info']?.['address_components'] || [];
            let city = getCityFromAddressComponents(addressComponents);
            let pincode = getPincodeFromAddressComponents(addressComponents);
            
            // Fallback to formatted address parsing if address components don't provide city/pincode
            const formattedAddress = data['location_info']['formatted_address'];
            console.log('Address components city:', city, 'pincode:', pincode);
            console.log('Formatted address:', formattedAddress);
            
            if ((!city || city === '') && formattedAddress) {
              city = extractCityFromFormattedAddress(formattedAddress);
              console.log('Extracted city from formatted address:', city, 'for address:', formattedAddress);
            }
            if ((!pincode || pincode === '') && formattedAddress) {
              pincode = extractPincodeFromFormattedAddress(formattedAddress);
              console.log('Extracted pincode from formatted address:', pincode, 'for address:', formattedAddress);
            }
            
            const currentGeolocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              formatted_address: formattedAddress,
              place_id: data.results?.[0]?.place_id,
              name: formattedAddress,
              city: city,
              pincode: pincode,
            };
            storeGeolocation(currentGeolocation);
            setIsLocating(false);
            resolve(currentGeolocation);
          } catch (error) {
            console.error("Error fetching location details:", error);
            storeGeolocation(defaultGeolocation);
            resolve(defaultGeolocation);
            setIsLocating(false);
          }
        },
        (error) => {
          console.warn(errorMessageMap[error.code].title || errorMessageMap[0].title);
          showAlert({
            title: errorMessageMap[error.code].title || errorMessageMap[0].title,
            text: errorMessageMap[error.code].message || errorMessageMap[0].message,
          });
          storeGeolocation(defaultGeolocation);
          reject();
          setIsLocating(false);
        },
        {
          enableHighAccuracy: !isAndroidApp,
          timeout: isAndroidApp ? 5000 : 30000,
        },
      );
    });
  }, [showAlert, storeGeolocation]);

  // Load geolocation from localStorage on component mount
  useEffect(() => {
    try {
      const storedGeolocation = localStorage.getItem("geolocation");
      let processedGeolocation = null;
      if (storedGeolocation) {
        processedGeolocation = processStoredGeolocation(storedGeolocation);
      }
      if (processedGeolocation) {
        setGeolocation(processedGeolocation);
        console.log('Loaded geolocation from localStorage:', processedGeolocation);
      } else {
        setGeolocation(null); // Ensure type safety
        // Only call locateMe if there is no valid geolocation in localStorage
        locateMe().catch(() => {
          console.warn('Failed to auto-locate on mount');
        });
      }
    } catch (error) {
      console.error("Error loading geolocation from localStorage:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        geolocation,
        isLocating,
        locateMe,
        storeGeolocation,
        getNameFromAddressComponents,
        getCityFromAddressComponents,
        getPincodeFromAddressComponents,
        extractCityFromFormattedAddress,
        extractPincodeFromFormattedAddress,
      }}>
      {children}
    </GeolocationContext.Provider>
  );
};

export default GeolocationProvider;

export const useGeolocation = () => {
  const context = useContext(GeolocationContext);
  
  // Add debugging function to check localStorage
  const debugLocalStorage = () => {
    try {
      const stored = localStorage.getItem("geolocation");
      console.log('Current localStorage geolocation:', stored);
      if (stored) {
        console.log('Parsed localStorage geolocation:', JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  };
  
  // Expose debug function in development
  if (process.env.NODE_ENV === 'development') {
    (window as any).debugGeolocationLocalStorage = debugLocalStorage;
  }
  
  return context;
};
