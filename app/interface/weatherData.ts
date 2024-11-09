interface weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface temperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

interface feels_like {
  day: number;
  night: number;
  eve: number;
  morn: number;
}
export interface DailyWeatherData {
  dt: number;
  sunrise?: number;
  sunset?: number;
  moonrise?: number;
  moonset?: number;
  moon_phase?: number;
  summary?: string;
  temp: temperature[];
  feels_like: feels_like[];
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: weather[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
}

export interface HourlyWeatherData {
  dt: number;
  sunrise?: number;
  sunset?: number;
  moonrise?: number;
  moonset?: number;
  moon_phase?: number;
  summary?: string;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: weather[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
  visibility: number;
}

interface CurrentWeatherData {
  dt: number;
  sunrise?: number;
  sunset?: number;
  moonrise?: number;
  moonset?: number;
  moon_phase?: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: weather[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
  visibility: number;
}
export interface weatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeatherData;
  daily: DailyWeatherData[];
  hourly: HourlyWeatherData[];
}

export interface cordinates {
  latitude: number;
  longitude: number;
}

export interface placeDetails {
  country: string;
  lat: number;
  lon: number;
  name: string;
  state: string;
}
