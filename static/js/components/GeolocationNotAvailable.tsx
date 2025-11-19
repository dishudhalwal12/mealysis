import React from "react";
import { Link } from "react-router";

export default function GeolocationNotAvailable() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Location is not available</h1>
      <p className="text-center text-gray-500 dark:text-gray-400">
        {"Please "}
        <Link to="/geolocation" className="text-blue-500 dark:text-blue-400 underline">
          {"select a location"}
        </Link>
        {" to see products near you."}
      </p>
    </div>
  );
}
