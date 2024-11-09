import { useEffect, useState } from "react";
import { cordinates } from "../interface/weatherData";
import { fetchCordinates } from "../api/fetchCords";

export const UseFetchCordinates = ({
  latitude = 28.6448,
  longitude = 77.216721,
}) => {
  const [location, setLocation] = useState<cordinates>({
    latitude,
    longitude,
  });
  const [error, setError] = useState<string>("");
  useEffect(() => {
    async function fetchCords() {
      try {
        const data: cordinates = await fetchCordinates();
        const { latitude, longitude } = data;

        setLocation(() => {
          return { latitude, longitude };
        });
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("An unknown error occurred while fetching coordinates.");
      }
    }
    navigator.geolocation.getCurrentPosition(
      (coords) => {
        const { latitude, longitude } = coords.coords;
        setLocation(() => {
          return { latitude, longitude };
        });
      },
      (error) => {
        fetchCords();
        if (error instanceof Error)
          console.log("Error fetching gps", error.message);
      }
    );
  }, []);
  return { location, error };
};
