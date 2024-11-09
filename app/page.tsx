"use client";

import Image from "next/image";
import { UseFetchCordinates } from "./hooks/useFetchCordinates";
import { useFetchWeatherData } from "./hooks/useFetchWeatherData";
import {
  convertToLocaleTime,
  getCurrentHour,
} from "./utilities/helperFunction";
import { useEffect, useState } from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import {
  cordinates,
  HourlyWeatherData,
  placeDetails,
} from "./interface/weatherData";
interface chartDataProps {
  Hour: number;
  Wind: number;
  Humidity: number;
  Temperature: number;
}
export default function Home() {
  const [locationData, setLocationData] = useState<cordinates>({
    latitude: 28.6448,
    longitude: 77.216721,
  });
  const { error, location } = UseFetchCordinates(locationData);

  const [imageIndex, setImageIndex] = useState(1);
  const [hourlyData, setHourlyData] = useState<chartDataProps[] | null>(null);
  const [searchResult, setSearchResult] = useState<placeDetails[] | []>([]);
  const [chartValue, setChartValue] = useState<
    "Wind" | "Humidity" | "Temperature"
  >("Wind");
  const [chartWidth, setChartWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth - 50 < 780 ? window.innerWidth - 50 : 780;
    }
    return 780;
  });

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(() => {
        return window.innerWidth - 50 < 780 ? window.innerWidth - 50 : 780;
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);
  const [searchWord, setSearchWord] = useState<string>("");
  const { weatherDetails, loading, weatherError, placeData } =
    useFetchWeatherData(locationData);
  const [weatherData, setWeatherData] = useState(weatherDetails);

  useEffect(() => {
    setLocationData(location);
  }, [location]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResult([]);
      return;
    }
    const response = await fetch(`/api/placeSearch?keyword=${e.target.value}`);

    const data: [] = await response.json();
    setSearchResult(data);
  };

  const handleSelect = (place: placeDetails) => {
    setSearchWord("");
    setSearchResult([]);
    setLocationData(() => {
      return {
        latitude: place.lat,
        longitude: place.lon,
      };
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setWeatherData(weatherDetails);
    const currHour = getCurrentHour(
      weatherData?.current.dt,
      weatherData?.timezone
    );
    const index = Math.round(currHour / 1.5);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    index > 0 ? setImageIndex(index) : setImageIndex(1);
    if (weatherData?.hourly) {
      const hourly: HourlyWeatherData[] = weatherData?.hourly;
      const chartData = hourly.map((data) => {
        return {
          Hour: getCurrentHour(data.dt),
          Wind: Number((data?.wind_speed * 3.6).toFixed(2)),
          Humidity: data.humidity,
          Temperature: Number(data.temp.toFixed(1)),
        };
      });
      if (chartData) setHourlyData(chartData.slice(0, 7));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherDetails, imageIndex]);

  if (weatherError || error)
    return (
      <div
        className="h-[100vh] flex align-middle justify-center items-center"
        style={{
          backgroundImage: `url(bg/Desert${imageIndex}.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "all 0.5s ease-in-out",
        }}
      ></div>
    );
  return (
    <div
      className="h-[100vh] md:flex  align-middle justify-center items-center md:p-5 p-1"
      style={{
        backgroundImage: `url(bg/Desert${imageIndex}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "all 0.5s ease-in-out",
      }}
    >
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
      {weatherData && (
        <div className="bg-[#e7e7e786]  text-black flex flex-col  md:mx-5 mx-1 rounded-xl p-5">
          <div className="flex md:flex-row flex-col items-center md:items-start  md:gap-16 gap-2">
            <div className="flex flex-col">
              <span className="md:text-4xl text-xl font-bold">
                {placeData?.name},{placeData?.state},{placeData?.country},
              </span>
              <div className="flex md:flex-row flex-row text-nowrap flex-wrap gap-2">
                <span className="text-nowrap">
                  {weatherData?.current.weather[0].description[0].toUpperCase() +
                    weatherData?.current.weather[0].description.slice(1)}
                  ,
                </span>
                <span>
                  {
                    convertToLocaleTime(
                      weatherData?.current.dt,
                      weatherData?.timezone
                    ).localeTime
                  }
                  ,
                </span>

                <span>
                  {
                    convertToLocaleTime(
                      weatherData?.current.dt,
                      weatherData?.timezone
                    ).actualTime
                  }
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                className="rounded-lg p-1 px-3 border-transparent md:w-96 w-60 focus:outline-none focus:border-transparent m-1"
                type="text"
                placeholder="Search"
                value={searchWord}
                onChange={handleSearch}
              />
              {searchResult.length > 0 && (
                <div className="absolute m-1 rounded-lg bg-white p-2 md:w-96 w-60 z-10">
                  {searchResult.map((data, index) => (
                    <span
                      onClick={() => handleSelect(data)}
                      key={index}
                      className="  block hover:bg-slate-300 px-2 rounded-lg cursor-pointer"
                    >
                      {data.name},{`${data.state ? `${data.state},` : ""}`}{" "}
                      {data.country}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex md:flex-row flex-col items-center justify-evenly ">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherData?.current.weather[0].icon}@2x.png`}
                  width={90}
                  height={60}
                  alt="weather"
                />
                <div className="flex flex-col md:w-44 w-fit">
                  <div className="flex flex-row justify-between">
                    <span>Pressure : </span>
                    <span>{weatherData?.current.pressure} hPa</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>Weather : </span>
                    <span>{weatherData?.current.weather[0].main}</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>Date : </span>
                    <span>
                      {
                        convertToLocaleTime(
                          weatherData?.current.dt,
                          weatherData?.timezone
                        ).dateString
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-row flex-col  justify-between">
                <span>Wind speed : </span>
                <span>
                  {" "}
                  {(weatherData?.current.wind_speed || 0) * 3.6} Km/H
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Wind gust : </span>
                <span> {(weatherData?.current.wind_gust || 0) * 3.6} Km/H</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Wind direction : </span>
                <span> {weatherData?.current.wind_deg}°</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Sunrise : </span>
                <span>
                  {convertToLocaleTime(weatherData?.current.sunrise).localeTime}
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Sunset : </span>
                <span>
                  {convertToLocaleTime(weatherData?.current.sunset).localeTime}
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Temperature : </span>
                <span>{weatherData?.current.temp} °C</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Feels like : </span>
                <span>{weatherData?.current.feels_like} °C</span>
              </div>
            </div>
            {hourlyData && (
              <div className="flex flex-col">
                <div className="flex flex-row justify-center gap-6">
                  <button
                    className="rounded-lg bg-slate-300 px-3"
                    onClick={() => setChartValue("Wind")}
                  >
                    Wind
                  </button>
                  <button
                    className="rounded-lg bg-slate-300 px-3"
                    onClick={() => setChartValue("Humidity")}
                  >
                    Humidity
                  </button>
                  <button
                    className="rounded-lg bg-slate-300 px-3"
                    onClick={() => setChartValue("Temperature")}
                  >
                    Temperature
                  </button>
                </div>
                <AreaChart
                  // className="w-96"
                  width={chartWidth}
                  height={250}
                  data={hourlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e7ce49" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#e7ce49" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis label={"Hours"} dataKey="Hour" />
                  <YAxis />
                  <Tooltip />

                  <Area
                    label={{
                      fill: "black",
                      fontSize: 14,
                      position: "insideTop",
                    }}
                    dot={{ stroke: "yellow", strokeWidth: 1 }}
                    type="monotone"
                    dataKey={chartValue}
                    stroke="#00000"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </div>
            )}
          </div>

          <div
            className="flex flex-row align-middle justify-center items-center gap-3 overflow-x-scroll text-nowrap"
            style={{ scrollbarWidth: "none" }}
          >
            {weatherData?.daily.map((dailyData, index) => (
              <div
                key={index}
                className="flex flex-col align-middle justify-center items-center bg-opacity-50 bg-yellow-300 p-2 rounded-lg"
              >
                <span className="block">
                  {dailyData.weather[0].description}
                </span>
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherData?.current.weather[0].icon}.png`}
                  width={50}
                  height={40}
                  alt="weather"
                />
                <span className="block">
                  {convertToLocaleTime(dailyData.dt).dateString}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
