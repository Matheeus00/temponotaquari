export interface ForecastDay {
  date: string;
  weekday: string;
  max: number | string;
  min: number | string;
  rain_probability: number | string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  rain: number | string;
  shortwaveRadiation: number;
}

export interface OutdoorConditionsData {
  uv?: UvIndexData;
  pollen?: {
    level: string;
    description: string;
  };
  airQuality?: AirQualityData;
}

export interface UvIndexData {
  index: number;
  level: string;
  dailyMax: number;
  dewPointCelsius?: number;
  precipitationMillimeters?: number;
  cloudCoverPercent?: number;
  isDay?: boolean;
  solarRadiationWm2?: number;
}

export interface AirQualityData {
  index: number;
  level: string;
  pollutants: Array<{
    name: string;
    value: number;
  }>;
}

export interface InmetAlert {
  id: string;
  phenomenon: string;
  severity: string;
  start: string;
  end: string;
  risks: string[];
  instructions: string[];
}

export interface InmetAlertsData {
  alerts: InmetAlert[];
}

export interface WeatherIndexData {
  value: number | string;
  description?: string;
}

export type WeatherIndexId =
  | 'barbecue'
  | 'mosquito'
  | 'frizz'
  | 'skin-dryness'
  | 'cold'
  | 'vitamin-d'
  | 'clothes-drying';

export type WeatherIndicesData = Partial<Record<WeatherIndexId, WeatherIndexData>>;

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
  outdoorConditions?: OutdoorConditionsData;
  weatherIndices?: WeatherIndicesData;
}

export interface WeatherResponse {
  results?: WeatherConditions;
}
