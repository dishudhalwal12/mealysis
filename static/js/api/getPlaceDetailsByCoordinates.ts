import { API_CONSTANT } from "./APIConstants.ts";

interface PlaceDetailsFromCoordinates {
  plus_code: Pluscode;
  results: Result[];
  status: string;
}

interface Result {
  address_components: Addresscomponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: Pluscode;
  types: string[];
}

interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds?: Viewport;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Location {
  lat: number;
  lng: number;
}

interface Addresscomponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Pluscode {
  compound_code: string;
  global_code: string;
}

export default async function getPlaceDetailsByCoordinates(
  latitude: number,
  longitude: number,
): Promise<PlaceDetailsFromCoordinates> {
  const response = await API_CONSTANT.makeRequest(
    `?lat=${latitude}&lon=${longitude}&type=geocode`
  );
  return response.json();
}
