import { Fragment } from 'react';
import type { HourlyForecast as HourlyForecastData } from '../../types';
import {
  formatTemperature,
  formatWindSpeed,
  getBeaufortIndex,
  getTemperatureUnitLabel,
  type TemperatureUnit,
  type WindSpeedUnit,
} from '../../utils/utils';

interface HourlyForecastProps {
  data: HourlyForecastData[] | null;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  selectedDay: boolean;
  periodLabel: string;
}

const getCondition = (code: number): { description: string; icon: string } => {
  if (code === 0) return { description: 'Céu limpo', icon: 'clear' };
  if (code <= 2) return { description: 'Parcialmente nublado', icon: 'partly-cloudy' };
  if (code === 3) return { description: 'Nublado', icon: 'overcast' };
  if (code === 45 || code === 48) return { description: 'Neblina', icon: 'fog' };
  if (code <= 57) return { description: 'Garoa', icon: 'drizzle' };
  if (code <= 67) return { description: 'Chuva', icon: 'rain' };
  if (code <= 77) return { description: 'Neve', icon: 'snow' };
  if (code <= 82) return { description: 'Pancadas de chuva', icon: 'rain' };
  if (code <= 86) return { description: 'Pancadas de neve', icon: 'snow' };
  if (code === 95) return { description: 'Trovoadas', icon: 'thunderstorms' };
  if (code <= 99) return { description: 'Trovoadas e granizo', icon: 'thunderstorms-rain' };
  return { description: 'Condição indisponível', icon: 'not-available' };
};

const getConditionIcon = (code: number, isDay: boolean): string => {
  const { icon } = getCondition(code);
  const timeSpecificIcons = new Set([
    'clear',
    'fog',
    'overcast',
    'partly-cloudy',
    'thunderstorms',
    'thunderstorms-rain',
  ]);
  return timeSpecificIcons.has(icon)
    ? `/condition/${isDay ? 'day' : 'night'}-${icon}.svg`
    : `/condition/${icon}.svg`;
};

const getHourLabel = (time: string): string => `${time.slice(11, 13)}h`;
const getLocalDate = (): string =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());

export const HourlyForecast = ({
  data,
  error,
  temperatureUnit,
  windSpeedUnit,
  selectedDay,
  periodLabel,
}: HourlyForecastProps) => {
  const today = getLocalDate();

  return (
    <div className="hourly-forecast">
    {error ? (
      <p className="hourly-forecast-message" role="alert">{error}</p>
    ) : data === null ? (
      <p className="hourly-forecast-message" aria-live="polite">
        <span className="loading-indicator" aria-hidden="true" />
        Carregando previsão por hora...
      </p>
    ) : data.length === 0 ? (
      <p className="hourly-forecast-message">Sem previsão por hora disponível.</p>
    ) : (
      <div
        className="hourly-forecast-track"
        aria-label={`Previsão do tempo ${periodLabel}`}
      >
        {data.map((hour, index) => {
          const condition = getCondition(hour.weatherCode);
          const isNextDay = !selectedDay && hour.time.slice(0, 10) > today;
          const startsNextDay = isNextDay && data[index - 1]?.time.slice(0, 10) !== hour.time.slice(0, 10);
          return (
            <Fragment key={hour.time}>
              {startsNextDay && (
                <div className="hourly-forecast-day-divider">
                  <span>Amanhã</span>
                </div>
              )}
              <article
                className="hourly-forecast-card"
                aria-label={`${getHourLabel(hour.time)}${isNextDay ? ', amanhã' : ''}: ${condition.description}, ${formatTemperature(hour.temperature, temperatureUnit)} ${getTemperatureUnitLabel(temperatureUnit)}, ${hour.precipitationProbability}% de chance de chuva`}
              >
                <div className="hourly-forecast-time">
                  <time dateTime={hour.time}>{getHourLabel(hour.time)}</time>
                </div>
                <img
                  className="hourly-forecast-icon"
                  src={getConditionIcon(hour.weatherCode, hour.isDay)}
                  alt=""
                />
                <p className="hourly-forecast-condition">{condition.description}</p>
                <p className="hourly-forecast-temperature">
                  {formatTemperature(hour.temperature, temperatureUnit)}
                  <small>{getTemperatureUnitLabel(temperatureUnit)}</small>
                </p>
                <div className="hourly-forecast-detail">
                  <img src="/condition/raindrop-measure.svg" alt="" />
                  <span>{hour.rain} mm</span>
                </div>
                <div className="hourly-forecast-detail">
                  <img src="/condition/raindrop.svg" alt="" />
                  <span>{hour.precipitationProbability}%</span>
                </div>
                <div className="hourly-forecast-detail hourly-forecast-wind">
                  <img src="/wind/wind.svg" alt="" />
                  <span>{formatWindSpeed(hour.windSpeed, windSpeedUnit)}</span>
                </div>
              </article>
            </Fragment>
          );
        })}
      </div>
    )}
    </div>
  );
};
