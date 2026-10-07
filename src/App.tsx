import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import { TAQUARI_VALLEY_CITIES } from './constants/cities';
import { Forecast } from './components/forecast/Forecast';
import { EclipseAlert } from './components/eclipse/EclipseAlert';
import { Moon } from './components/moon/Moon';
import { OutdoorConditions } from './components/outdoor/OutdoorConditions';
import { Rose } from './components/rose/Rose';
import {
  dayHour,
  getCurrentTimeColor,
  getRainDropCount,
  getWeatherEffect,
  formatWindSpeed,
  isDarkColor,
  type TemperatureUnit,
  type WindSpeedUnit,
} from './utils/utils';
import { Weather } from './components/weather/Weather';
import type { WeatherConditions, WeatherResponse } from './types';

function App() {
  const [weather, setWeather] = useState<WeatherConditions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('lajeado');
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('C');
  const [windSpeedUnit, setWindSpeedUnit] = useState<WindSpeedUnit>('km/h');

  useEffect(() => {
    const controller = new AbortController();

    setWeather(null);
    setError(null);
    axios.get<WeatherResponse>('/api/weather', {
      params: { city: selectedCityId },
      signal: controller.signal,
    })
      .then(({ data }) => {
        if (!data.results) {
          throw new Error('A resposta da API não contém os dados do clima.');
        }
        setWeather(data.results);
      })
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError)) {
          setError(
            axios.isAxiosError<{ error?: string }>(requestError)
              ? requestError.response?.data.error ?? requestError.message
              : requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar a previsão do tempo.',
          );
        }
      });

    return () => controller.abort();
  }, [selectedCityId]);

  const backgroundColor = getCurrentTimeColor();
  const backgroundTheme = isDarkColor(backgroundColor) ? 'App--dark-background' : '';
  const appClassName = `App page-shell ${backgroundTheme}`.trim();

  if (error) {
    return (
      <main className={appClassName} style={{ backgroundColor }}>
        <div className="app-message app-message-error" role="alert">
          <span className="message-icon" aria-hidden="true">!</span>
          <div>
            <h1>Não foi possível carregar o clima</h1>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!weather) {
    return (
      <main className={appClassName} style={{ backgroundColor }}>
        <div className="app-message" aria-live="polite">
          <span className="loading-indicator" aria-hidden="true" />
          <p>Carregando previsão do tempo...</p>
        </div>
      </main>
    );
  }

  const hour = dayHour();
  const time = hour >= 6 && hour <= 18 ? 'day' : 'night';
  const weatherEffect = getWeatherEffect(weather.condition_code, weather.temp);

  return (
    <main className={`${appClassName} weather-${weatherEffect ?? 'clear'}`} style={{ backgroundColor }}>
      {weatherEffect && (
        <div className="weather-effects" aria-hidden="true">
          {weatherEffect === 'rain' && Array.from(
            { length: getRainDropCount(weather.condition_code, weather.rain) },
            (_, index) => (
              <span
                className="rain-drop"
                key={index}
                style={{
                  left: `${(index * 37) % 100}%`,
                  animationDelay: `${-((index * 0.37) % 2.8)}s`,
                  animationDuration: `${2.6 + (index % 4) * 0.25}s`,
                }}
              />
            ),
          )}
        </div>
      )}
      <header className="app-header">
        <a className="brand" href="/" aria-label="Tempo no Taquari, início">
          <span className="brand-icon" aria-hidden="true">
            <img src="/condition/day-partly-cloudy.svg" alt="" />
          </span>
          <span className="brand-name">Tempo <span>no Taquari</span></span>
        </a>
        <label className="location-badge">
          <span className="location-pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <select
            className="location-select"
            aria-label="Selecionar cidade"
            value={selectedCityId}
            onChange={(event) => setSelectedCityId(event.target.value)}
          >
            {TAQUARI_VALLEY_CITIES.map((city) => (
              <option key={city.id} value={city.id}>{city.name}, RS</option>
            ))}
          </select>
          <span className="live-dot" aria-label="Dados atuais" />
        </label>
      </header>

      <EclipseAlert />

      <section className="dashboard-heading" aria-labelledby="page-title">
        <p className="eyebrow">PAINEL DO TEMPO</p>
        <p className="dashboard-date">
          {new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }).format(new Date())}
        </p>
        <h1 id="page-title">O céu de hoje</h1>
        <div className="unit-controls" aria-label="Unidades de medida">
          <label>
            <span>Temperatura</span>
            <select
              value={temperatureUnit}
              onChange={(event) => {
                if (event.target.value === 'C' || event.target.value === 'F' || event.target.value === 'K') {
                  setTemperatureUnit(event.target.value);
                }
              }}
              aria-label="Unidade de temperatura"
            >
              <option value="C">°C</option>
              <option value="F">°F</option>
              <option value="K">K</option>
            </select>
          </label>
          <label>
            <span>Vento</span>
            <select
              value={windSpeedUnit}
              onChange={(event) => {
                const unit = event.target.value;
                if (unit === 'km/h' || unit === 'mph' || unit === 'm/s' || unit === 'kn') {
                  setWindSpeedUnit(unit);
                }
              }}
              aria-label="Unidade de velocidade do vento"
            >
              <option value="km/h">km/h</option>
              <option value="mph">mph</option>
              <option value="m/s">m/s</option>
              <option value="kn">nós</option>
            </select>
          </label>
        </div>
      </section>

      <section className="current-data" aria-label="Condições atuais">
        <Weather
          code={weather.condition_code}
          temp={weather.temp}
          temperatureUnit={temperatureUnit}
          time={time}
          sunrise={weather.sunrise}
          sunset={weather.sunset}
          description={weather.description}
          humidity={weather.humidity}
          rain={weather.rain}
          cloudiness={weather.cloudiness}
        />
        <Rose
          rotation={weather.wind_direction}
          speed={weather.wind_speedy}
          displaySpeed={formatWindSpeed(weather.wind_speedy, windSpeedUnit)}
        />
        <Moon moon={weather.moon_phase} />
        <OutdoorConditions data={weather.outdoorConditions} />
      </section>

      <section className="forecast-section" aria-labelledby="forecast-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PRÓXIMOS DIAS</p>
            <h2 id="forecast-title">Previsão estendida</h2>
          </div>
          <span className="section-caption">Acompanhe o que vem por aí</span>
        </div>
        <Forecast data={weather.forecast} temperatureUnit={temperatureUnit} />
      </section>

      <footer className="app-footer">
        <div className="footer-brand">
          <span className="footer-weather-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="21.5" cy="10.5" r="5" />
              <path d="M21.5 2.5v2M29.5 10.5h-2M27.2 4.8l-1.4 1.4M15.8 4.8l1.4 1.4" />
              <path d="M8 24.5h15a5 5 0 0 0 .3-10 7 7 0 0 0-13.4 1.9A4 4 0 0 0 8 24.5Z" />
            </svg>
          </span>
          <span className="footer-copy">
            <strong>Tempo no Taquari</strong>
            <span>O tempo do Vale do Taquari, de um jeito simples.</span>
          </span>
        </div>
        <div className="footer-meta">
          <a href="mailto:contato@temponotaquari.com.br">
            contato@temponotaquari.com.br
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
              <path d="m3 5 5 4 5-4" />
            </svg>
          </a>
          <a href="https://hgbrasil.com/status/weather" target="_blank" rel="noreferrer">
            Dados meteorológicos por HG Brasil
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <span>© {new Date().getFullYear()} Tempo no Taquari</span>
        </div>
      </footer>
    </main>
  );
}

export default App;