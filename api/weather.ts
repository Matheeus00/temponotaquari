import type { IncomingMessage, ServerResponse } from 'node:http';

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

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    sendJson(response, 503, { error: 'A API do clima não está configurada no servidor.' });
    return;
  }

  const weatherUrl = new URL('https://api.hgbrasil.com/weather');
  weatherUrl.searchParams.set('format', 'json-cors');
  weatherUrl.searchParams.set('key', apiKey);
  weatherUrl.searchParams.set('city_name', 'Lajeado,RS');

  try {
    const upstreamResponse = await fetch(weatherUrl, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstreamResponse.ok) {
      console.error(`Weather provider returned HTTP ${upstreamResponse.status}.`);
      sendJson(response, 502, { error: 'O serviço de clima não conseguiu atender à solicitação.' });
      return;
    }

    const weatherData: unknown = await upstreamResponse.json();
    response.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    sendJson(response, 200, weatherData);
  } catch (error: unknown) {
    console.error(
      'Weather provider request failed:',
      error instanceof Error ? error.name : 'Unknown error',
    );
    sendJson(response, 502, { error: 'Não foi possível consultar o serviço de clima.' });
  }
}
