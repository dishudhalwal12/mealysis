import { API_CONSTANT } from "./APIConstants.ts";

interface MapSuggestionsResponse {
  predictions: Prediction[];
  status: string;
}

interface Prediction {
  description: string;
  matched_substrings: Matchedsubstring[];
  place_id: string;
  reference: string;
  structured_formatting: Structuredformatting;
  terms: Term[];
  types: string[];
}

interface Term {
  offset: number;
  value: string;
}

interface Structuredformatting {
  main_text: string;
  main_text_matched_substrings: Matchedsubstring[];
  secondary_text: string;
}

interface Matchedsubstring {
  length: number;
  offset: number;
}

export default async function getMapSuggestions(input: string): Promise<MapSuggestionsResponse> {
  const response = await API_CONSTANT.makeRequest(
    `?type=mapsuggest&query=${input}`
  );
  return response.json();
}
