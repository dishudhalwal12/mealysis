import { Geolocation } from "../context/GeolocationContext";
import { API_CONSTANT } from "./APIConstants.ts";

export interface ProductSearchSuggestion {
  name: string;
  subtitle: string;
  image: string;
}

export default async function getProductSearchSuggestions(
  geolocation: Geolocation,
  query: string,
): Promise<ProductSearchSuggestion[]> {
  if (!geolocation) {
    throw new Error("Geolocation is not available");
  }

  const response = await API_CONSTANT.makeRequest(
    `?lat=${geolocation.latitude}&lon=${geolocation.longitude}&type=autosuggest&query=${query}`
  );
  const data = await response.json();
  console.log('Product search suggestions response:', data);
  return data;
}
