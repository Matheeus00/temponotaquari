import type { IncomingMessage, ServerResponse } from 'node:http';
import { getTaquariValleyCity } from '../src/constants/cities.js';
import { fetchHgBrasilWeather, HgBrasilHttpError } from '../src/services/hgBrasil.js';

const sendJson = (response: ServerResponse, statusCode: number, data: unknown) => {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(data));
};

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    sendJson(response, 405, { error: 'Método não permitido.' });
    return;
  }

  const cityId = new URL(request.url ?? '/', 'http://localhost').searchParams.get('city') ?? 'lajeado';
  const city = getTaquariValleyCity(cityId);
  if (!city) {
    sendJson(response, 400, { error: 'A cidade selecionada não está disponível.' });
    return;
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    sendJson(response, 503, { error: 'A API do clima não está configurada no servidor.' });
    return;
  }

  try {
    const weatherData = await fetchHgBrasilWeather(city.name, apiKey);
    if (typeof weatherData !== 'object' || weatherData === null || Array.isArray(weatherData)) {
      throw new Error('Weather provider returned an invalid response.');
    }
    const fetchedAt = new Date().toISOString();
    response.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    sendJson(response, 200, { ...weatherData, fetchedAt });
  } catch (error: unknown) {
    if (error instanceof HgBrasilHttpError) {
      console.error(`Weather provider returned HTTP ${error.status}.`);
      sendJson(response, 502, { error: 'O serviço de clima não conseguiu atender à solicitação.' });
    } else {
      console.error(
        'Weather provider request failed:',
        error instanceof Error ? error.name : 'Unknown error',
      );
      sendJson(response, 502, { error: 'Não foi possível consultar o serviço de clima.' });
    }
  }
}
