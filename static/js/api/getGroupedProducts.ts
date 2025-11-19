import { Geolocation } from "../context/GeolocationContext";
import { API_CONSTANT } from "./APIConstants.ts";

export interface Marketplace {
  name: string;
  sla: string;
  storeId: string;
  icon: string;
}

export interface GroupedProductOption {
  platform: Marketplace;
  id: string;
  name: string;
  brand: string;
  available: boolean;
  images: string[];
  mrp: number;
  offer_price: number;
  unit_level_price: number;
  quantity: string;
  deeplink: string;
}

export interface GroupedProduct {
  data: GroupedProductOption[];
}

// Helper function to extract pincode from formatted_address
function extractPincodeFromAddress(formattedAddress: string): string | null {
  if (!formattedAddress) return null;
  
  try {
    // Parse the JSON string to get the formatted_address property
    const parsedData = JSON.parse(formattedAddress);
    const address = parsedData.formatted_address || formattedAddress;
    
    // Regex to match 6-digit pincode pattern
    const pincodeRegex = /\b\d{6}\b/;
    const match = address.match(pincodeRegex);
    
    return match ? match[0] : null;
  } catch (error) {
    // If parsing fails, treat the input as a plain string
    const pincodeRegex = /\b\d{6}\b/;
    const match = formattedAddress.match(pincodeRegex);
    
    return match ? match[0] : null;
  }
}

export default async function getGroupedProducts(
  geolocation: Geolocation,
  query: string,
  marketplaceDetails?: any // Accept marketplaceDetails as an optional argument
): Promise<GroupedProduct[]> {
  if (!geolocation) {
    throw new Error("Geolocation is not available");
  }

  // Get formatted_address from localStorage
  const formattedAddress = localStorage.getItem('geolocation');
  const pincode = formattedAddress ? extractPincodeFromAddress(formattedAddress) : null;

  // Build query parameters
  const params = new URLSearchParams({
    lat: geolocation.latitude.toString(),
    lon: geolocation.longitude.toString(),
    type: 'groupsearch',
    query: query
  });

  // Add pincode to query parameters if available
  if (pincode) {
    params.append('pincode', pincode);
  }

  // If marketplaceDetails is provided, add it to the payload (POST body)
  let fetchOptions: RequestInit = {};
  if (marketplaceDetails && marketplaceDetails.eta && marketplaceDetails.eta.length > 0) {
    fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eta: marketplaceDetails.eta, pincode: pincode, address: geolocation })
    };
  }

  const response = await API_CONSTANT.makeRequest(
    `?${params.toString()}`,
    fetchOptions.method ? fetchOptions : undefined
  );
  
  try {
    return await response.json();
  } catch (error) {
    console.error("Error fetching grouped products:", error);
    return [{ data: [] }];
  }
}
