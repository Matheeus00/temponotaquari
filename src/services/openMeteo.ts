import type { AirQualityData, UvIndexData } from '../types.js';

interface Coordinates {
  latitude: number;
  longitude: number;
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
  url.searchParams.set('current', 'uv_index,dew_point_2m,precipitation,cloud_cover,is_day');
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
  };
}
