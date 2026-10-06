export interface ForecastDay {
  date: string;
  weekday: string;
  max: number | string;
  min: number | string;
  rain_probability: number | string;
}

export interface WeatherConditions {
  condition_code: number;
  temp: number | string;
  sunrise: string;
  sunset: string;
  description: string;
  humidity: number | string;
  rain: number | string;
  cloudiness: number | string;
  wind_direction: number;
  wind_speedy: string;
  moon_phase: string;
  forecast: ForecastDay[];
}

export interface WeatherResponse {
  results?: WeatherConditions;
}
