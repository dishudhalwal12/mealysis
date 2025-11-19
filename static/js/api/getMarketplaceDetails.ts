import { API_CONSTANT } from "./APIConstants.ts";

export interface MarketplaceDetailsResponse {
  eta: Eta[];
  trending: string[];
  trendingItems: TrendingItems[];
}

export interface TrendingItems {
  name: string;
  image: string;
}

export interface Eta {
  eta: string;
  image: string;
  platform: string;
  url: string;
  open: boolean;
}

export default async function getMarketplaceDetails(
  latitude: number,
  longitude: number,
): Promise<MarketplaceDetailsResponse> {
  const response = await API_CONSTANT.makeRequest(
    `?lat=${latitude}&lon=${longitude}&type=home`
  );
  const data = await response.json();
  return data;
}
