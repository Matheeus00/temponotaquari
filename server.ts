import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTaquariValleyCity } from './src/constants/cities.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(projectDirectory, 'dist');

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Limite de solicitações excedido. Tente novamente em alguns minutos.' },
}));

app.get('/api/weather', async (request, response) => {
  const city = getTaquariValleyCity(
    typeof request.query.city === 'string' ? request.query.city : 'lajeado',
  );
  if (!city) {
    response.status(400).json({ error: 'A cidade selecionada não está disponível.' });
    return;
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    response.status(503).json({ error: 'A API do clima não está configurada no servidor.' });
    return;
  }

  const weatherUrl = new URL('https://api.hgbrasil.com/weather');
  weatherUrl.searchParams.set('format', 'json-cors');
  weatherUrl.searchParams.set('key', apiKey);
  weatherUrl.searchParams.set('city_name', `${city.name},RS`);

  try {
    const upstreamResponse = await fetch(weatherUrl, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstreamResponse.ok) {
      console.error(`Weather provider returned HTTP ${upstreamResponse.status}.`);
      response.status(502).json({ error: 'O serviço de clima não conseguiu atender à solicitação.' });
      return;
    }

    const weatherData: unknown = await upstreamResponse.json();
    response.json(weatherData);
  } catch (error: unknown) {
    console.error(
      'Weather provider request failed:',
      error instanceof Error ? error.name : 'Unknown error',
    );
    response.status(502).json({ error: 'Não foi possível consultar o serviço de clima.' });
  }
});

app.use(express.static(distDirectory));

app.listen(port, () => {
  console.log(`Taquari no Tempo server listening on port ${port}.`);
});
