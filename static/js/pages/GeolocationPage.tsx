import React, { useCallback, useState } from "react";
import {
  GeolocationPrediction,
  useGeolocation,
  getCityFromAddressComponents,
  getPincodeFromAddressComponents,
  extractCityFromFormattedAddress,
  extractPincodeFromFormattedAddress,
} from "../context/GeolocationContext.tsx";
import throttle from "lodash.throttle";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import Loader from "../components/Loader.tsx";
import getPlaceDetailsByPlaceId from "../api/getPlaceDetailsByPlaceId.ts";
import getMapSuggestions from "../api/getMapSuggestions.ts";
import BackButton from "../components/BackButton.tsx";
import GradiantSeparator from "../components/GradiantSeparator.tsx";
import { IconSearch, IconCurrentLocation } from "@tabler/icons-react";

const GeolocationPage = () => {
  const { isLocating, locateMe, storeGeolocation } = useGeolocation();
  const navigate = useNavigate();
  const [isStoringCustomLocation, setIsStoringCustomLocation] = useState(false);
  const [locationPredictions, setLocationPredictions] = useState([] as GeolocationPrediction[]);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getInputLocationSuggestions = useCallback(
    throttle(async (input: string) => {
      try {
        const data = await getMapSuggestions(input);
        setLocationPredictions(data.predictions);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setPredictionError(error.message);
      }
    }, 1000),
    [],
  );

  const handleLocationSearchInput = (e) => {
    e.preventDefault();

    if (!e.target.value) {
      setLocationPredictions([]);
      setPredictionError(null);
      return;
    }

    if (e.target.value?.length > 1) {
      getInputLocationSuggestions(e.target.value);
    }
  };

  const onClickLocationPrediction = useCallback(
    (prediction: GeolocationPrediction) => {
      setIsStoringCustomLocation(true);
      getPlaceDetailsByPlaceId(prediction.place_id)
        .then((data) => {
          const location = data['coordinate'];
          
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
          
          storeGeolocation({
            latitude: location.lat,
            longitude: location.lon,
            formatted_address: formattedAddress,
            place_id: prediction.place_id,
            name: formattedAddress,
            city: city,
            pincode: pincode,
          });
          navigate("/");
        })
        .catch((error) => {
          console.error("Error fetching location details:", error);
        })
        .finally(() => {
          setIsStoringCustomLocation(false);
        });
    },
    [navigate, storeGeolocation],
  );

  const onClickLocateMe = () => {
    locateMe()
      .then(() => {
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div className="flex h-full flex-col">
      <div className="py-4">
        <div className="flex grow flex-col">
          <div className="flex grow flex-row gap-4">
            <BackButton />
            <div className="relative grow pr-4">
              <IconSearch className="text-slate-950 dark:text-gray-300 absolute left-2.5 top-[13px] h-4 w-4 text-bg-dark dark:text-white" />
              <input
                type="search"
                placeholder="Manually enter location"
                className="w-full cursor-pointer rounded-xl border border-action dark:border-transparent bg-grey-light dark:bg-grey-dark p-2 ps-8 focus:cursor-auto focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                onInput={handleLocationSearchInput}
              />
            </div>
          </div>
          <div className="mb-2 w-full px-4 py-2">
            <button
              onClick={onClickLocateMe}
              className={twMerge("mb-2 mt-4 w-full rounded-lg bg-action p-2 text-white flex items-center justify-center gap-2")}>
              <IconCurrentLocation className="h-5 w-5" />
              Use Current Location
            </button>
          </div>

          {predictionError ? (
            <div className="overflow-y-auto border-t">
              <p className="text-red-500 p-2">{predictionError}</p>
            </div>
          ) : locationPredictions.length ? (
            <div className="overflow-y-auto px-4">
              {locationPredictions.map((prediction) => (
                <>
                  <button
                    key={prediction.place_id}
                    className="hover:bg-gray-100 w-full p-2 text-left"
                    onClick={() => onClickLocationPrediction(prediction)}>
                    <p>{prediction.structured_formatting.main_text}</p>
                    <p className="text-xs">{prediction.structured_formatting.secondary_text}</p>
                  </button>
                  <GradiantSeparator />
                </>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {/* <div className="absolute bottom-4 flex flex-col text-slate-500">
          <p className="text-xs">Formatted Address: {geolocation?.formatted_address || "N/A"}</p>
          <p className="text-xs">Name: {geolocation?.name || "N/A"}</p>
          <p className="text-xs">Place ID: {geolocation?.place_id || "N/A"}</p>
          <p className="text-xs">Latitude: {geolocation?.latitude || "N/A"}</p>
          <p className="text-xs">Longitude: {geolocation?.longitude || "N/A"}</p>
        </div> */}
      {isLocating || isStoringCustomLocation ? (
        <div className="bg-black absolute inset-40 bg-opacity-30">
          <Loader variant="default" />
        </div>
      ) : null}
    </div>
  );
};

export default GeolocationPage;
