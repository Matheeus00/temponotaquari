import type { HourlyForecast } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';

interface ClothesDryingIndexProps {
  forecast: HourlyForecast[];
  periodLabel: string;
}

type DryingLevel = 'poor' | 'fair' | 'good' | 'excellent';

const levels: Record<DryingLevel, { value: string; description: string }> = {
  poor: {
    value: 'Ruim',
    description: 'Chuva prevista ou umidade alta pode dificultar a secagem.',
  },
  fair: {
    value: 'Razoável',
    description: 'As roupas podem demorar mais para secar; confira a chuva prevista.',
  },
  good: {
    value: 'Bom',
    description: 'Temperatura e radiação favoráveis, com risco de chuva limitado.',
  },
  excellent: {
    value: 'Muito bom',
    description: 'Tempo quente, seco e ensolarado favorece a secagem.',
  },
};

const getDryingEstimate = (forecast: HourlyForecast[]) => {
  const daylight = forecast.filter((hour) => hour.isDay);
  if (
    daylight.length === 0
    || forecast.some((hour) =>
      !Number.isFinite(hour.humidity)
      || hour.humidity < 0
      || hour.humidity > 100
      || !Number.isFinite(hour.temperature)
      || !Number.isFinite(hour.windSpeed)
      || !Number.isFinite(hour.shortwaveRadiation)
      || !Number.isFinite(hour.precipitationProbability)
      || !Number.isFinite(Number(hour.rain)))
  ) {
    return undefined;
  }

  const average = (values: number[]) =>
    values.reduce((total, value) => total + value, 0) / values.length;
  const averageHumidity = average(daylight.map((hour) => hour.humidity));
  const averageTemperature = average(daylight.map((hour) => hour.temperature));
  const averageRadiation = average(daylight.map((hour) => hour.shortwaveRadiation));
  const averageWindSpeed = average(daylight.map((hour) => hour.windSpeed));
  const maximumRainProbability = Math.max(...forecast.map((hour) => hour.precipitationProbability));
  const totalRain = forecast.reduce((total, hour) => total + Number(hour.rain), 0);
  const likelyRainHours = forecast.filter((hour) =>
    Number(hour.rain) >= 0.2 || hour.precipitationProbability >= 60).length;

  let level: DryingLevel;
  if (likelyRainHours >= 2 || totalRain >= 1 || averageHumidity >= 80) {
    level = 'poor';
  } else if (
    maximumRainProbability < 20
    && averageHumidity <= 55
    && averageTemperature >= 20
    && averageRadiation >= 400
    && averageWindSpeed >= 5
    && averageWindSpeed <= 25
  ) {
    level = 'excellent';
  } else if (
    maximumRainProbability < 40
    && averageHumidity <= 65
    && averageTemperature >= 18
    && averageRadiation >= 200
    && totalRain < 0.2
  ) {
    level = 'good';
  } else {
    level = 'fair';
  }

  return { level, ...levels[level] };
};

export const ClothesDryingIndex = ({ forecast, periodLabel }: ClothesDryingIndexProps) => {
  const estimate = getDryingEstimate(forecast);

  return (
    <WeatherIndexCard
      id="clothes-drying"
      label="Secagem de roupas"
      value={estimate?.value}
      description={estimate
        ? `${periodLabel}: ${estimate.description}`
        : undefined}
      level={estimate?.level}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é estimado?">
          <div className="weather-index-guide-content">
            <h3>Condições para secar roupas</h3>
            <p>
              A estimativa considera a temperatura, a umidade, o vento, a radiação solar
              e a chuva prevista por hora durante o período indicado. As médias de
              temperatura, umidade, vento e radiação consideram apenas as horas de dia.
            </p>
            <ul>
              <li className="weather-clothes-drying-level-poor"><strong>Ruim</strong><span>Umidade média diurna de 80% ou mais, chuva acumulada de 1 mm ou mais, ou chuva provável em pelo menos duas horas.</span></li>
              <li className="weather-clothes-drying-level-fair"><strong>Razoável</strong><span>Condições que não atendem aos critérios de bom ou muito bom, mas sem os fatores que levam ao nível ruim.</span></li>
              <li className="weather-clothes-drying-level-good"><strong>Bom</strong><span>Chance máxima de chuva abaixo de 40%, umidade média de até 65%, temperatura média de pelo menos 18 °C e radiação média de pelo menos 200 W/m².</span></li>
              <li className="weather-clothes-drying-level-excellent"><strong>Muito bom</strong><span>Chance máxima de chuva abaixo de 20%, umidade média de até 55%, temperatura de pelo menos 20 °C, radiação de pelo menos 400 W/m² e vento entre 5 e 25 km/h.</span></li>
            </ul>
            <p className="weather-index-guide-note">
              É uma referência, não um tempo exato de secagem. Tecido, quantidade de
              roupa, sombra e ventilação do local também fazem diferença.
            </p>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
