import type { IncomingMessage, ServerResponse } from 'node:http';
import { getTaquariValleyCity } from '../src/constants/cities.js';
import { getInmetAlerts } from '../src/services/inmet.js';

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

  try {
    const alerts = await getInmetAlerts(city.name);
    response.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    sendJson(response, 200, { alerts });
  } catch (error: unknown) {
    console.error(
      'INMET alert request failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    sendJson(response, 502, { error: 'Não foi possível consultar os avisos do INMET agora.' });
  }
}
