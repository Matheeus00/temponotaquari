import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { TAQUARI_VALLEY_CITIES } from './constants/cities';
import { Forecast } from './components/forecast/Forecast';
import { HourlyForecast } from './components/forecast/HourlyForecast';
import { BackToTop } from './components/common/BackToTop';
import { CitySelection } from './components/common/CitySelection';
import {
  getHolidayForDate,
  getHolidayScopeLabel,
  getHolidayTypeLabel,
} from './data/holidays';
import { AboutPage } from './components/about/AboutPage';
import { AgroPage } from './components/agro/AgroPage';
import { AstronomyPage } from './components/sky/AstronomyPage';
import { InmetAlerts } from './components/inmet/InmetAlerts';
import { WeatherIndices } from './components/indices/WeatherIndices';
import { SolarPotential } from './components/outdoor/SolarPotential';
import { OutdoorConditions } from './components/outdoor/OutdoorConditions';
import { Rose } from './components/rose/Rose';
import {
  dayHour,
  getCurrentTimeColor,
  formatWindSpeed,
  isDarkColor,
  type TemperatureUnit,
  type WindSpeedUnit,
} from './utils/utils';
import { Weather, WeatherAdvice } from './components/weather/Weather';
import type {
  AirQualityData,
  HourlyForecast as HourlyForecastData,
  InmetAlertsData,
  UvIndexData,
  WeatherConditions,
  WeatherResponse,
} from './types';

type AppSection = 'panel' | 'forecast' | 'astronomy' | 'agro' | 'about';

const WEATHER_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

const getSeason = (date: Date): string => {
  const monthDay = (date.getMonth() + 1) * 100 + date.getDate();
  if (monthDay >= 1221 || monthDay < 320) return 'verão';
  if (monthDay < 621) return 'outono';
  if (monthDay < 922) return 'inverno';
  return 'primavera';
};

const getSavedCityId = (): string | null => {
  try {
    const savedCityId = window.localStorage.getItem('tempo-no-taquari:selected-city');
    return TAQUARI_VALLEY_CITIES.find((city) => city.id === savedCityId)?.id ?? null;
  } catch (error: unknown) {
    console.error(
      'Unable to read the saved city preference:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return null;
  }
};

function App() {
  const [weather, setWeather] = useState<WeatherConditions | null>(null);
  const [lastWeatherFetchedAt, setLastWeatherFetchedAt] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [error, setError] = useState<string | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[] | null>(null);
  const [hourlyForecastError, setHourlyForecastError] = useState<string | null>(null);
  const [selectedForecast, setSelectedForecast] = useState<{ dateKey: string; label: string } | null>(null);
  const [showTodayForecast, setShowTodayForecast] = useState(false);
  const [activeSection, setActiveSection] = useState<AppSection>('panel');
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [airQualityError, setAirQualityError] = useState<string | null>(null);
  const [isAirQualityLoading, setIsAirQualityLoading] = useState(true);
  const [uvIndex, setUvIndex] = useState<UvIndexData | null>(null);
  const [uvIndexError, setUvIndexError] = useState<string | null>(null);
  const [isUvIndexLoading, setIsUvIndexLoading] = useState(true);
  const [inmetAlerts, setInmetAlerts] = useState<{
    cityId: string;
    data: InmetAlertsData;
  } | null>(null);
  const [inmetAlertsError, setInmetAlertsError] = useState<{
    cityId: string;
    message: string;
  } | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(getSavedCityId);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('C');
  const [windSpeedUnit, setWindSpeedUnit] = useState<WindSpeedUnit>('km/h');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshAnimationKey, setRefreshAnimationKey] = useState(0);
  const previousCityId = useRef<string | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentDate(new Date()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!selectedCityId) return;
    try {
      window.localStorage.setItem('tempo-no-taquari:selected-city', selectedCityId);
    } catch (error: unknown) {
      console.error(
        'Unable to save the selected city preference:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }, [selectedCityId]);

  useEffect(() => {
    if (!selectedCityId) return;
    const controller = new AbortController();

    const cityChanged = previousCityId.current !== selectedCityId;
    previousCityId.current = selectedCityId;
    if (cityChanged) {
      setSelectedForecast(null);
      setShowTodayForecast(false);
      setWeather(null);
      setLastWeatherFetchedAt(null);
      setHourlyForecast(null);
      setAirQuality(null);
      setUvIndex(null);
      setInmetAlerts(null);
    }
    setIsRefreshing(true);
    setError(null);
    setHourlyForecastError(null);
    setAirQualityError(null);
    setIsAirQualityLoading(true);
    setUvIndexError(null);
    setIsUvIndexLoading(true);
    setInmetAlertsError(null);
    const weatherRequest = axios.get<WeatherResponse>('/api/weather', {
      params: { city: selectedCityId },
      signal: controller.signal,
    })
      .then(({ data }) => {
        if (!data.results) {
          throw new Error('A resposta da API não contém os dados do clima.');
        }
        const fetchedAt = typeof data.fetchedAt === 'string' ? new Date(data.fetchedAt) : null;
        if (!fetchedAt || !Number.isFinite(fetchedAt.getTime())) {
          throw new Error('A resposta do servidor não informou o horário da consulta.');
        }
        setWeather(data.results);
        setLastWeatherFetchedAt(fetchedAt);
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

    const hourlyForecastRequest = axios.get<{ forecast: HourlyForecastData[] }>('/api/hourly-forecast', {
      params: { city: selectedCityId },
      signal: controller.signal,
    })
      .then(({ data }) => {
        if (!Array.isArray(data.forecast)) {
          throw new Error('A resposta da API não contém a previsão por hora.');
        }
        setHourlyForecast(data.forecast);
      })
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError)) {
          setHourlyForecastError(
            axios.isAxiosError<{ error?: string }>(requestError)
              ? requestError.response?.data.error ?? requestError.message
              : requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar a previsão por hora.',
          );
        }
      });

    const airQualityRequest = axios.get<AirQualityData>('/api/air-quality', {
      params: { city: selectedCityId },
      signal: controller.signal,
    })
      .then(({ data }) => {
        setAirQuality(data);
        setIsAirQualityLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError)) {
          setAirQualityError(
            axios.isAxiosError<{ error?: string }>(requestError)
              ? requestError.response?.data.error ?? requestError.message
              : requestError instanceof Error
              ? requestError.message
              : 'Não foi possível consultar a qualidade do ar agora.',
          );
          setIsAirQualityLoading(false);
        }
      });

    const uvIndexRequest = axios.get<UvIndexData>('/api/uv-index', {
      params: { city: selectedCityId },
      signal: controller.signal,
    })
      .then(({ data }) => {
        setUvIndex(data);
        setIsUvIndexLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError)) {
          setUvIndexError(
            axios.isAxiosError<{ error?: string }>(requestError)
              ? requestError.response?.data.error ?? requestError.message
              : requestError instanceof Error
              ? requestError.message
              : 'Não foi possível consultar o índice UV agora.',
          );
          setIsUvIndexLoading(false);
        }
      });

    const inmetAlertsRequest = axios.get<InmetAlertsData>('/api/inmet-alerts', {
      params: { city: selectedCityId },
      signal: controller.signal,
    })
      .then(({ data }) => {
        setInmetAlerts({ cityId: selectedCityId, data });
      })
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError)) {
          setInmetAlertsError(
            {
              cityId: selectedCityId,
              message: axios.isAxiosError<{ error?: string }>(requestError)
                ? requestError.response?.data.error ?? requestError.message
                : requestError instanceof Error
                ? requestError.message
                : 'Não foi possível consultar os avisos do INMET agora.',
            },
          );
        }
      });

    void Promise.allSettled([
      weatherRequest,
      hourlyForecastRequest,
      airQualityRequest,
      uvIndexRequest,
      inmetAlertsRequest,
    ]).then(() => {
      if (!controller.signal.aborted) {
        setIsRefreshing(false);
      }
    });

    return () => controller.abort();
  }, [refreshKey, selectedCityId]);

  useEffect(() => {
    if (!selectedCityId || !lastWeatherFetchedAt) return;
    const controller = new AbortController();
    let timeoutId: number;
    const refreshWeather = () => {
      axios.get<WeatherResponse>('/api/weather', {
        params: { city: selectedCityId },
        signal: controller.signal,
      })
        .then(({ data }) => {
          if (!data.results) {
            throw new Error('A resposta da API não contém os dados do clima.');
          }
          const fetchedAt = typeof data.fetchedAt === 'string' ? new Date(data.fetchedAt) : null;
          if (!fetchedAt || !Number.isFinite(fetchedAt.getTime())) {
            throw new Error('A resposta do servidor não informou o horário da consulta.');
          }
          setWeather(data.results);
          setLastWeatherFetchedAt(fetchedAt);
        })
        .catch((requestError: unknown) => {
          if (!axios.isCancel(requestError)) {
            console.error(
              'Weather refresh failed:',
              requestError instanceof Error ? requestError.message : 'Unknown error',
            );
            timeoutId = window.setTimeout(refreshWeather, WEATHER_REFRESH_INTERVAL_MS);
          }
        });
    };
    timeoutId = window.setTimeout(
      refreshWeather,
      Math.max(0, lastWeatherFetchedAt.getTime() + WEATHER_REFRESH_INTERVAL_MS - Date.now()),
    );

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [lastWeatherFetchedAt, selectedCityId]);

  useEffect(() => {
    if (!selectedCityId) return;
    const controller = new AbortController();
    const intervalId = window.setInterval(() => {
      axios.get<UvIndexData>('/api/uv-index', {
        params: { city: selectedCityId },
        signal: controller.signal,
      })
        .then(({ data }) => {
          setUvIndex(data);
          setUvIndexError(null);
          setIsUvIndexLoading(false);
        })
        .catch((requestError: unknown) => {
          if (!axios.isCancel(requestError)) {
            setUvIndexError(
              axios.isAxiosError<{ error?: string }>(requestError)
                ? requestError.response?.data.error ?? requestError.message
                : requestError instanceof Error
                ? requestError.message
                : 'Não foi possível consultar o índice UV agora.',
            );
            setIsUvIndexLoading(false);
          }
        });
    }, WEATHER_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      controller.abort();
    };
  }, [selectedCityId]);

  const backgroundColor = getCurrentTimeColor(weather?.sunrise, weather?.sunset, currentDate);
  const backgroundTheme = isDarkColor(backgroundColor) ? 'App--dark-background' : '';
  const appClassName = `App page-shell ${backgroundTheme}`.trim();
  const canManuallyRefresh = lastWeatherFetchedAt !== null
    && currentDate.getTime() - lastWeatherFetchedAt.getTime() >= WEATHER_REFRESH_INTERVAL_MS;

  useEffect(() => {
    const root = document.getElementById('root');
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousDocumentBackground = document.documentElement.style.backgroundColor;
    const previousRootBackground = root?.style.backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;
    if (root) root.style.backgroundColor = backgroundColor;

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
      document.documentElement.style.backgroundColor = previousDocumentBackground;
      if (root) root.style.backgroundColor = previousRootBackground ?? '';
    };
  }, [backgroundColor]);

  if (!selectedCityId) {
    return (
      <CitySelection
        onConfirm={setSelectedCityId}
        backgroundColor={backgroundColor}
      />
    );
  }

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

  const localToday = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
  }).format(currentDate);
  const selectedCity = TAQUARI_VALLEY_CITIES.find((city) => city.id === selectedCityId);
  const todayHoliday = getHolidayForDate(localToday, selectedCityId);
  const visibleHourlyForecast = hourlyForecast === null
    ? null
    : selectedForecast
    ? hourlyForecast.filter((hour) => hour.time.slice(0, 10) === selectedForecast.dateKey)
    : showTodayForecast
    ? hourlyForecast.filter((hour) => hour.time.slice(0, 10) === localToday)
    : hourlyForecast.slice(0, 24);
  const rainProbabilityNextSixHours = hourlyForecast && hourlyForecast.length > 0
    ? Math.max(...hourlyForecast.slice(0, 6).map((hourly) => hourly.precipitationProbability))
    : null;
  const handleForecastDaySelect = (day: { dateKey: string; label: string }) => {
    setActiveSection('forecast');
    setSelectedForecast(day);
    setShowTodayForecast(false);
    window.requestAnimationFrame(() => {
      document.getElementById('hourly-forecast-title')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };
  const hour = dayHour();
  const time = hour >= 6 && hour <= 18 ? 'day' : 'night';
  const navigateToSection = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <main className={appClassName} style={{ backgroundColor }}>
      <header className="app-header">
        <a className="brand" href="/" aria-label="Tempo no Taquari, início">
          <span className="brand-icon" aria-hidden="true">
            <img src="/condition/day-partly-cloudy.svg" alt="" />
          </span>
          <span className="brand-name">Tempo <span>no Taquari</span></span>
        </a>
        <nav className="app-navigation" aria-label="Navegação principal">
          <button
            type="button"
            aria-current={activeSection === 'panel' ? 'page' : undefined}
            onClick={() => navigateToSection('panel')}
          >
            Painel
          </button>
          <button
            type="button"
            aria-current={activeSection === 'forecast' ? 'page' : undefined}
            onClick={() => navigateToSection('forecast')}
          >
            Previsão
          </button>
          <button
            type="button"
            aria-current={activeSection === 'astronomy' ? 'page' : undefined}
            onClick={() => navigateToSection('astronomy')}
          >
            Astronomia
          </button>
          <button
            type="button"
            aria-current={activeSection === 'agro' ? 'page' : undefined}
            onClick={() => navigateToSection('agro')}
          >
            Agro
          </button>
          <button
            type="button"
            aria-current={activeSection === 'about' ? 'page' : undefined}
            onClick={() => navigateToSection('about')}
          >
            Sobre
          </button>
        </nav>
        {lastWeatherFetchedAt && (
          <div className="last-updated">
            <span>
              Dados atualizados às{' '}
              <time dateTime={lastWeatherFetchedAt.toISOString()}>
                {new Intl.DateTimeFormat('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Sao_Paulo',
                }).format(lastWeatherFetchedAt)}
              </time>
            </span>
          </div>
        )}
        <button
          className="refresh-button"
          type="button"
          onClick={() => {
            setRefreshAnimationKey((key) => key + 1);
            const now = new Date();
            setCurrentDate(now);
            if (
              !isRefreshing &&
              lastWeatherFetchedAt &&
              now.getTime() - lastWeatherFetchedAt.getTime() >= WEATHER_REFRESH_INTERVAL_MS
            ) {
              setRefreshKey((key) => key + 1);
            }
          }}
          aria-label={
            isRefreshing
              ? 'Atualizando dados'
              : canManuallyRefresh
              ? 'Atualizar horário e dados'
              : 'Atualizar horário; os dados serão consultados no próximo intervalo'
          }
          title={!canManuallyRefresh ? 'Atualiza o relógio; os dados são consultados a cada 10 minutos' : undefined}
        >
          <svg
            key={refreshAnimationKey}
            className={`refresh-icon${isRefreshing ? ' refresh-icon-spinning' : ' refresh-icon-clicked'}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" />
          </svg>
          {isRefreshing ? 'Atualizando' : 'Atualizar'}
        </button>
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

      {activeSection === 'panel' && (
        <>
      <section className="dashboard-heading" aria-labelledby="page-title">
        <div className="dashboard-eyebrow">
          <p className="eyebrow">PAINEL DO TEMPO</p>
          {todayHoliday && (
            <span
              className={`forecast-day-holiday-label dashboard-holiday-label forecast-day-holiday-${todayHoliday.scope === 'Brasil' ? 'national' : todayHoliday.scope === 'Municipal' ? 'municipal' : 'state'}`}
              title={`${getHolidayTypeLabel(todayHoliday)} ${getHolidayScopeLabel(todayHoliday.scope)}: ${todayHoliday.name}`}
              aria-label={`${getHolidayTypeLabel(todayHoliday)} ${getHolidayScopeLabel(todayHoliday.scope)}: ${todayHoliday.name}`}
            >
              {getHolidayTypeLabel(todayHoliday)} · {todayHoliday.name}
            </span>
          )}
        </div>
        <p className="dashboard-date">
          <span>
            {new Intl.DateTimeFormat('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }).format(currentDate)}
            {' · '}
            {getSeason(currentDate)}
          </span>
        </p>
        <h1 id="page-title">
          O céu de hoje em <b>{selectedCity?.name}, RS</b>
        </h1>
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

      <InmetAlerts
        alerts={inmetAlerts?.cityId === selectedCityId ? inmetAlerts.data.alerts : []}
        error={inmetAlertsError?.cityId === selectedCityId ? inmetAlertsError.message : null}
        cityName={TAQUARI_VALLEY_CITIES.find((city) => city.id === selectedCityId)?.name ?? ''}
      />

      <WeatherAdvice
        time={time}
        temp={weather.temp}
        temperatureUnit={temperatureUnit}
        humidity={weather.humidity}
        windSpeed={weather.wind_speedy}
        rain={weather.rain}
        rainProbabilityNextSixHours={rainProbabilityNextSixHours}
        uvIndex={uvIndex?.index ?? weather.outdoorConditions?.uv?.index}
      />

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
          windSpeed={weather.wind_speedy}
          rain={weather.rain}
          cloudiness={weather.cloudiness}
          rainProbabilityNextSixHours={rainProbabilityNextSixHours}
        />
        <Rose
          rotation={weather.wind_direction}
          speed={weather.wind_speedy}
          displaySpeed={formatWindSpeed(weather.wind_speedy, windSpeedUnit)}
          windSpeedUnit={windSpeedUnit}
        />
        <SolarPotential
          isDay={uvIndex?.isDay ?? weather.outdoorConditions?.uv?.isDay}
          radiation={uvIndex?.solarRadiationWm2 ?? weather.outdoorConditions?.uv?.solarRadiationWm2}
          error={uvIndexError}
          isLoading={isUvIndexLoading}
        />
        <OutdoorConditions
          temperatureUnit={temperatureUnit}
          temperature={weather.temp}
          humidity={weather.humidity}
          data={{
            ...weather.outdoorConditions,
            uv: uvIndex ?? weather.outdoorConditions?.uv,
            airQuality: airQuality ?? weather.outdoorConditions?.airQuality,
          }}
          airQualityError={airQualityError}
          isAirQualityLoading={isAirQualityLoading}
          uvIndexError={uvIndexError}
          isUvIndexLoading={isUvIndexLoading}
        />
      </section>

        </>
      )}

      {activeSection === 'forecast' && (
        <section className="forecast-page" aria-label="Previsão do tempo">
          <section className="hourly-forecast-section" aria-labelledby="hourly-forecast-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">PREVISÃO HORÁRIA</p>
                <h1 id="hourly-forecast-title">
                  {selectedForecast
                    ? `Previsão para ${selectedForecast.label}`
                    : showTodayForecast
                    ? 'Previsão para hoje'
                    : 'Previsão nas próximas 24 horas'}
                </h1>
              </div>
              <div className="hourly-forecast-view-controls" aria-label="Período da previsão horária">
                <button
                  className="hourly-forecast-reset"
                  type="button"
                  aria-pressed={!selectedForecast && !showTodayForecast}
                  onClick={() => {
                    setSelectedForecast(null);
                    setShowTodayForecast(false);
                  }}
                >
                  Próximas 24 horas
                </button>
                <button
                  className="hourly-forecast-reset"
                  type="button"
                  aria-pressed={!selectedForecast && showTodayForecast}
                  onClick={() => {
                    setSelectedForecast(null);
                    setShowTodayForecast(true);
                  }}
                >
                  Hoje
                </button>
              </div>
            </div>
            <HourlyForecast
              data={visibleHourlyForecast}
              error={hourlyForecastError}
              temperatureUnit={temperatureUnit}
              windSpeedUnit={windSpeedUnit}
              selectedDay={selectedForecast !== null}
              periodLabel={selectedForecast?.label ?? (showTodayForecast ? 'para hoje' : 'para as próximas 24 horas')}
            />
          </section>

          <section className="forecast-section" aria-labelledby="forecast-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">PRÓXIMOS DIAS</p>
                <h2 id="forecast-title">Previsão estendida</h2>
              </div>
              <span className="section-caption">Selecione um dia para ver os detalhes por hora</span>
            </div>
            <Forecast
              data={weather.forecast}
              cityId={selectedCityId}
              temperatureUnit={temperatureUnit}
              selectedDate={selectedForecast?.dateKey ?? null}
              onSelectDay={handleForecastDaySelect}
            />
          </section>

          <WeatherIndices
            data={weather.weatherIndices}
            humidity={weather.humidity}
            temperature={weather.temp}
            cloudiness={weather.cloudiness}
            forecast={weather.forecast.slice(1, 4)}
            todayForecast={weather.forecast[0]}
            hourlyForecast={visibleHourlyForecast ?? []}
            selectedDate={selectedForecast?.dateKey ?? null}
            periodLabel={selectedForecast ? selectedForecast.label : 'Próximas 24 horas'}
            uvForecast={uvIndex ?? weather.outdoorConditions?.uv}
            temperatureUnit={temperatureUnit}
          />
        </section>
      )}

      {activeSection === 'agro' && <AgroPage selectedCityId={selectedCityId} />}

      {activeSection === 'astronomy' && selectedCity && (
        <AstronomyPage
          moonPhase={weather.moon_phase}
          precipitationMillimeters={uvIndex?.precipitationMillimeters}
          cloudCoverPercent={uvIndex?.cloudCoverPercent}
          latitude={selectedCity.latitude}
          longitude={selectedCity.longitude}
          date={currentDate}
        />
      )}

      {activeSection === 'about' && <AboutPage />}

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
          <a href="https://forms.gle/Qdpy1CjZKuJyub6X7" target="_blank" rel="noreferrer">
            Enviar feedback
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <a href="https://hgbrasil.com/status/weather" target="_blank" rel="noreferrer">
            Dados meteorológicos por HG Brasil
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Qualidade do ar e índice UV por Open-Meteo
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <a href="https://bas.dev/work/meteocons" target="_blank" rel="noreferrer">
            Ícones por Meteocons
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">
            Dados de qualidade do ar do CAMS
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <a href="https://press.exoss.org/calendario/" target="_blank" rel="noreferrer">
            Calendário de meteoros por EXOSS
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" />
            </svg>
          </a>
          <span>© {new Date().getFullYear()} Tempo no Taquari</span>
        </div>
      </footer>
      <BackToTop />
    </main>
  );
}

export default App;