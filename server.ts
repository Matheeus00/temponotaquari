import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTaquariValleyCity } from './src/constants/cities.js';
import { fetchHgBrasilWeather, HgBrasilHttpError } from './src/services/hgBrasil.js';
import { getInmetAlerts } from './src/services/inmet.js';
import {
  getOpenMeteoAirQuality,
  getOpenMeteoHourlyForecast,
  getOpenMeteoUvIndex,
} from './src/services/openMeteo.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(projectDirectory, 'dist');

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
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

  try {
    const weatherData = await fetchHgBrasilWeather(city.name, apiKey);
    if (typeof weatherData !== 'object' || weatherData === null || Array.isArray(weatherData)) {
      throw new Error('Weather provider returned an invalid response.');
    }
    response.json({ ...weatherData, fetchedAt: new Date().toISOString() });
  } catch (error: unknown) {
    if (error instanceof HgBrasilHttpError) {
      console.error(`Weather provider returned HTTP ${error.status}.`);
      response.status(502).json({ error: 'O serviço de clima não conseguiu atender à solicitação.' });
    } else {
      console.error(
        'Weather provider request failed:',
        error instanceof Error ? error.name : 'Unknown error',
      );
      response.status(502).json({ error: 'Não foi possível consultar o serviço de clima.' });
    }
  }
});

app.get('/api/air-quality', async (request, response) => {
  const city = getTaquariValleyCity(
    typeof request.query.city === 'string' ? request.query.city : 'lajeado',
  );
  if (!city) {
    response.status(400).json({ error: 'A cidade selecionada não está disponível.' });
    return;
  }

  try {
    const airQuality = await getOpenMeteoAirQuality(city);
    response.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.json(airQuality);
  } catch (error: unknown) {
    console.error(
      'Open-Meteo air-quality request failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    response.status(502).json({ error: 'Não foi possível consultar a qualidade do ar agora.' });
  }
});

app.get('/api/hourly-forecast', async (request, response) => {
  const city = getTaquariValleyCity(
    typeof request.query.city === 'string' ? request.query.city : 'lajeado',
  );
  if (!city) {
    response.status(400).json({ error: 'A cidade selecionada não está disponível.' });
    return;
  }

  try {
    const forecast = await getOpenMeteoHourlyForecast(city);
    response.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.json({ forecast });
  } catch (error: unknown) {
    console.error(
      'Open-Meteo hourly forecast request failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    response.status(502).json({ error: 'Não foi possível consultar a previsão por hora agora.' });
  }
});

app.get('/api/uv-index', async (request, response) => {
  const city = getTaquariValleyCity(
    typeof request.query.city === 'string' ? request.query.city : 'lajeado',
  );
  if (!city) {
    response.status(400).json({ error: 'A cidade selecionada não está disponível.' });
    return;
  }

  try {
    const uvIndex = await getOpenMeteoUvIndex(city);
    response.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.json(uvIndex);
  } catch (error: unknown) {
    console.error(
      'Open-Meteo UV-index request failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    response.status(502).json({ error: 'Não foi possível consultar o índice UV agora.' });
  }
});

app.get('/api/inmet-alerts', async (request, response) => {
  const city = getTaquariValleyCity(
    typeof request.query.city === 'string' ? request.query.city : 'lajeado',
  );
  if (!city) {
    response.status(400).json({ error: 'A cidade selecionada não está disponível.' });
    return;
  }

  try {
    const alerts = await getInmetAlerts(city.name);
    response.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.json({ alerts });
  } catch (error: unknown) {
    console.error(
      'INMET alert request failed:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    response.status(502).json({ error: 'Não foi possível consultar os avisos do INMET agora.' });
  }
});

app.use(express.static(distDirectory));

app.listen(port, () => {
  console.log(`Tempo no Taquari server listening on port ${port}.`);
});
