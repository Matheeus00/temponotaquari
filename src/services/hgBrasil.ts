export class HgBrasilHttpError extends Error {
  constructor(readonly status: number) {
    super(`HG Brasil returned HTTP ${status}.`);
    this.name = 'HgBrasilHttpError';
  }
}

export async function fetchHgBrasilWeather(cityName: string, apiKey: string): Promise<unknown> {
  const weatherUrl = new URL('https://api.hgbrasil.com/weather');
  weatherUrl.searchParams.set('format', 'json-cors');
  weatherUrl.searchParams.set('key', apiKey);
  weatherUrl.searchParams.set('city_name', `${cityName},RS`);

  const response = await fetch(weatherUrl, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new HgBrasilHttpError(response.status);
  }

  return response.json() as Promise<unknown>;
}
