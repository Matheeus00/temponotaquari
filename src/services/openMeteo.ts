import type { AirQualityData, HourlyForecast, UvIndexData } from '../types.js';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface HourlyForecastResponse {
  current: {
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    is_day: number[];
    wind_speed_10m: number[];
    rain: number[];
    shortwave_radiation: number[];
  };
}

const isHourlyForecastResponse = (data: unknown): data is HourlyForecastResponse => {
  if (typeof data !== 'object' || data === null || !('current' in data) || !('hourly' in data)) {
    return false;
  }

  const { current, hourly } = data;
  return (
    typeof current === 'object' &&
    current !== null &&
    'time' in current &&
    typeof current.time === 'string' &&
    typeof hourly === 'object' &&
    hourly !== null &&
    'time' in hourly &&
    Array.isArray(hourly.time) &&
    hourly.time.every((value) => typeof value === 'string') &&
    'temperature_2m' in hourly &&
    Array.isArray(hourly.temperature_2m) &&
    'relative_humidity_2m' in hourly &&
    Array.isArray(hourly.relative_humidity_2m) &&
    'precipitation_probability' in hourly &&
    Array.isArray(hourly.precipitation_probability) &&
    'weather_code' in hourly &&
    Array.isArray(hourly.weather_code) &&
    'is_day' in hourly &&
    Array.isArray(hourly.is_day) &&
    'wind_speed_10m' in hourly &&
    Array.isArray(hourly.wind_speed_10m) &&
    'rain' in hourly &&
    Array.isArray(hourly.rain) &&
    'shortwave_radiation' in hourly &&
    Array.isArray(hourly.shortwave_radiation)
  );
};

export async function getOpenMeteoHourlyForecast(
  coordinates: Coordinates,
): Promise<HourlyForecast[]> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(coordinates.latitude));
  url.searchParams.set('longitude', String(coordinates.longitude));
  url.searchParams.set(
    'hourly',
    'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day,wind_speed_10m,rain,shortwave_radiation',
  );
  url.searchParams.set('current', 'temperature_2m');
  url.searchParams.set('forecast_days', '16');
  url.searchParams.set('timezone', 'America/Sao_Paulo');

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Open-Meteo returned HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (!isHourlyForecastResponse(data)) {
    throw new Error('Open-Meteo returned an invalid hourly forecast.');
  }

  const { current, hourly } = data;
  const lengths = [
    hourly.temperature_2m.length,
    hourly.relative_humidity_2m.length,
    hourly.precipitation_probability.length,
    hourly.weather_code.length,
    hourly.is_day.length,
    hourly.wind_speed_10m.length,
    hourly.rain.length,
    hourly.shortwave_radiation.length,
  ];
  if (lengths.some((length) => length !== hourly.time.length)) {
    throw new Error('Open-Meteo hourly forecast contains mismatched data.');
  }

  const currentHourIndex = hourly.time.findIndex((time) => time > current.time);
  if (currentHourIndex < 0) {
    throw new Error('Open-Meteo hourly forecast does not contain the current hour.');
  }

  return hourly.time.slice(currentHourIndex).map((time, offset) => {
    const index = currentHourIndex + offset;
    const temperature = hourly.temperature_2m[index];
    const humidity = hourly.relative_humidity_2m[index];
    const precipitationProbability = hourly.precipitation_probability[index];
    const weatherCode = hourly.weather_code[index];
    const isDay = hourly.is_day[index];
    const windSpeed = hourly.wind_speed_10m[index];
    const rain = hourly.rain[index];
    const shortwaveRadiation = hourly.shortwave_radiation[index];
    if (
      typeof temperature !== 'number' ||
      !Number.isFinite(temperature) ||
      typeof humidity !== 'number' ||
      !Number.isFinite(humidity) ||
      humidity < 0 ||
      humidity > 100 ||
      typeof precipitationProbability !== 'number' ||
      !Number.isFinite(precipitationProbability) ||
      precipitationProbability < 0 ||
      precipitationProbability > 100 ||
      typeof weatherCode !== 'number' ||
      !Number.isFinite(weatherCode) ||
      (isDay !== 0 && isDay !== 1) ||
      typeof windSpeed !== 'number' ||
      !Number.isFinite(windSpeed) ||
      windSpeed < 0 ||
      typeof rain !== 'number' ||
      !Number.isFinite(rain) ||
      rain < 0 ||
      typeof shortwaveRadiation !== 'number' ||
      !Number.isFinite(shortwaveRadiation) ||
      shortwaveRadiation < 0
    ) {
      throw new Error('Open-Meteo hourly forecast contains invalid measurements.');
    }

    return {
      time,
      temperature,
      humidity,
      precipitationProbability,
      weatherCode,
      isDay: isDay === 1,
      windSpeed,
      rain,
      shortwaveRadiation,
    };
  });
}

const getAirQualityLevel = (index: number): string => {
  if (index <= 50) return 'Bom';
  if (index <= 100) return 'Moderado';
  if (index <= 150) return 'Insalubre para grupos sensíveis';
  if (index <= 200) return 'Insalubre';
  if (index <= 300) return 'Muito insalubre';
  return 'Perigoso';
};

export async function getOpenMeteoAirQuality(
  coordinates: Coordinates,
): Promise<AirQualityData> {
  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', String(coordinates.latitude));
  url.searchParams.set('longitude', String(coordinates.longitude));
  url.searchParams.set('current', 'us_aqi,pm2_5,pm10');
  url.searchParams.set('timezone', 'America/Sao_Paulo');

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Open-Meteo returned HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (typeof data !== 'object' || data === null || !('current' in data)) {
    throw new Error('Open-Meteo returned an invalid response.');
  }

  const current = data.current;
  if (
    typeof current !== 'object' ||
    current === null ||
    !('us_aqi' in current) ||
    typeof current.us_aqi !== 'number' ||
    !Number.isFinite(current.us_aqi) ||
    current.us_aqi < 0
  ) {
    throw new Error('Open-Meteo response does not contain a valid US AQI.');
  }

  const pollutants = [
    ['PM2,5', 'pm2_5' in current ? current.pm2_5 : null],
    ['PM10', 'pm10' in current ? current.pm10 : null],
  ]
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]))
    .map(([name, value]) => ({ name, value }));

  return {
    index: current.us_aqi,
    level: getAirQualityLevel(current.us_aqi),
    pollutants,
  };
}

const getUvLevel = (index: number): string => {
  if (index < 3) return 'Baixo';
  if (index < 6) return 'Moderado';
  if (index < 8) return 'Alto';
  if (index < 11) return 'Muito alto';
  return 'Extremo';
};

export async function getOpenMeteoUvIndex(
  coordinates: Coordinates,
): Promise<UvIndexData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(coordinates.latitude));
  url.searchParams.set('longitude', String(coordinates.longitude));
  url.searchParams.set(
    'current',
    'uv_index,dew_point_2m,precipitation,cloud_cover,is_day,shortwave_radiation',
  );
  url.searchParams.set('daily', 'uv_index_max');
  url.searchParams.set('timezone', 'America/Sao_Paulo');

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Open-Meteo returned HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (
    typeof data !== 'object' ||
    data === null ||
    !('current' in data) ||
    !('daily' in data)
  ) {
    throw new Error('Open-Meteo returned an invalid UV-index response.');
  }

  const current = data.current;
  const daily = data.daily;
  if (
    typeof current !== 'object' ||
    current === null ||
    !('uv_index' in current) ||
    typeof current.uv_index !== 'number' ||
    !Number.isFinite(current.uv_index) ||
    current.uv_index < 0
  ) {
    throw new Error('Open-Meteo response does not contain a valid UV index.');
  }
  if (
    typeof daily !== 'object' ||
    daily === null ||
    !('uv_index_max' in daily) ||
    !Array.isArray(daily.uv_index_max) ||
    typeof daily.uv_index_max[0] !== 'number' ||
    !Number.isFinite(daily.uv_index_max[0]) ||
    daily.uv_index_max[0] < 0
  ) {
    throw new Error('Open-Meteo response does not contain today’s maximum UV index.');
  }

  return {
    index: current.uv_index,
    level: getUvLevel(current.uv_index),
    dailyMax: daily.uv_index_max[0],
    dewPointCelsius:
      'dew_point_2m' in current &&
      typeof current.dew_point_2m === 'number' &&
      Number.isFinite(current.dew_point_2m)
        ? current.dew_point_2m
        : undefined,
    precipitationMillimeters:
      'precipitation' in current &&
      typeof current.precipitation === 'number' &&
      Number.isFinite(current.precipitation) &&
      current.precipitation >= 0
        ? current.precipitation
        : undefined,
    cloudCoverPercent:
      'cloud_cover' in current &&
      typeof current.cloud_cover === 'number' &&
      Number.isFinite(current.cloud_cover) &&
      current.cloud_cover >= 0 &&
      current.cloud_cover <= 100
        ? current.cloud_cover
        : undefined,
    isDay:
      'is_day' in current && (current.is_day === 0 || current.is_day === 1)
        ? current.is_day === 1
        : undefined,
    solarRadiationWm2:
      'shortwave_radiation' in current &&
      typeof current.shortwave_radiation === 'number' &&
      Number.isFinite(current.shortwave_radiation) &&
      current.shortwave_radiation >= 0
        ? current.shortwave_radiation
        : undefined,
  };
}
