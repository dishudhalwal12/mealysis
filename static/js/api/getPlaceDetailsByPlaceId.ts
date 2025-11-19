import { API_CONSTANT } from "./APIConstants.ts";

interface PlaceDetailsByPlaceIdResponse {
  html_attributions: any[];
  result: {
    address_components: { long_name: string; short_name: string; types: string[] }[];
    adr_address: string;
    formatted_address: string;
    geometry: {
      location: { lat: number; lng: number };
      viewport: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
    };
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    place_id: string;
    reference: string;
    types: string[];
    url: string;
    utc_offset: number;
    vicinity: string;
  };
  status: string;
}

export default async function getPlaceDetailsByPlaceId(
  placeId: string,
): Promise<PlaceDetailsByPlaceIdResponse> {
  const response = await API_CONSTANT.makeRequest(
    `?type=placedetails&query=${placeId}`
  );
  return response.json();
}
