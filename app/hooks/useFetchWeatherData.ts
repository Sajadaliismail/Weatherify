import { useEffect, useState } from "react";
import {
  cordinates,
  weatherResponse,
  placeDetails,
} from "../interface/weatherData";

export const useFetchWeatherData = (location: cordinates) => {
  const [weatherDetails, setWeatherDetails] = useState<null | weatherResponse>(
    null
  );
  const [placeData, setPlaceData] = useState<null | placeDetails>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!location.latitude || !location.longitude)
          throw new Error("Error fetching location");
        setLoading(true);
        const { latitude, longitude } = location;
        const weatherResponse = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );

        const placeResponse = await fetch(
          `/api/placeDetails?lat=${latitude}&lon=${longitude}`
        );

        const placeDetails = await placeResponse.json();

        const result: weatherResponse = await weatherResponse.json();

        if (weatherResponse.ok) {
          setWeatherDetails(result);
        } else throw new Error("Error fetching weather data");

        if (placeResponse.ok) {
          setPlaceData(placeDetails[0]);
        } else throw new Error("Error fetching weather data");
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error fetching weather data", error.message);
          setWeatherError(error.message);
        } else setWeatherError("Error fetching weather data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [location]);
  return { weatherDetails, weatherError, loading, placeData };
};
