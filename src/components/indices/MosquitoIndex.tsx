import type { ForecastDay, WeatherIndexData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { parseIndexNumber } from './indexUtils';
import {
  formatTemperature,
  getTemperatureUnitLabel,
  type TemperatureUnit,
} from '../../utils/utils';

interface MosquitoIndexProps {
  data?: WeatherIndexData;
  temperature: number | string;
  forecast: ForecastDay[];
  temperatureUnit: TemperatureUnit;
}

type MosquitoLevel = 'low' | 'moderate' | 'high';

const getLevel = (value: string): MosquitoLevel | undefined => {
  const normalized = value.trim().toLocaleLowerCase('pt-BR');
  if (normalized === 'baixo') return 'low';
  if (normalized === 'moderado') return 'moderate';
  if (normalized === 'alto') return 'high';
  return undefined;
};

const getMosquitoIndex = (temperature: number | string, forecast: ForecastDay[]) => {
  const temperatureValue = parseIndexNumber(temperature);
  if (!Number.isFinite(temperatureValue) || forecast.length === 0) return undefined;

  const rainProbabilities = forecast.slice(0, 3).map((day) => parseIndexNumber(day.rain_probability));
  if (rainProbabilities.some((probability) =>
    !Number.isFinite(probability) || probability < 0 || probability > 100)) {
    return undefined;
  }

  const rainyDays = rainProbabilities.filter((probability) => probability >= 50).length;
  const selectedDay = forecast.length === 1;
  if (temperatureValue < 20 || rainyDays === 0) {
    return {
      value: 'Baixo',
      description: selectedDay
        ? 'Temperatura amena ou baixa chance de chuva reduz o potencial de mosquitos neste dia.'
        : 'Tempo mais seco ou com temperaturas amenas reduz o potencial de mosquitos.',
    };
  }
  if (temperatureValue >= 30 && rainyDays >= (selectedDay ? 1 : 2)) {
    return {
      value: 'Alto',
      description: selectedDay
        ? 'Calor intenso e chuva provável criam condições favoráveis a mosquitos neste dia.'
        : 'Calor intenso e chuvas frequentes criam condições muito favoráveis a mosquitos.',
    };
  }
  return {
    value: 'Moderado',
    description: selectedDay
      ? 'As condições de temperatura e chuva favorecem presença moderada de mosquitos neste dia.'
      : 'Calor leve e chuvas ocasionais favorecem presença moderada de mosquitos.',
  };
};

export const MosquitoIndex = ({
  data,
  temperature,
  forecast,
  temperatureUnit,
}: MosquitoIndexProps) => {
  const metric = data ?? getMosquitoIndex(temperature, forecast);
  const level = metric ? getLevel(String(metric.value)) : undefined;

  return (
    <WeatherIndexCard
      id="mosquito"
      label="Mosquito"
      value={metric?.value}
      description={metric?.description}
      level={level}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é calculado?">
          <div className="weather-index-guide-content">
            <h3>Estimativa de condições para mosquitos</h3>
            <p>
              A estimativa combina a temperatura atual com a probabilidade de chuva
              prevista para os próximos três dias. Um dia conta como chuvoso quando a
              probabilidade é de 50% ou mais.
            </p>
            <ul>
              <li className="weather-mosquito-level-low"><strong>Baixo</strong><span>Temperatura abaixo de {formatTemperature(20, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} ou nenhum dos três dias com probabilidade de chuva de 50% ou mais.</span></li>
              <li className="weather-mosquito-level-moderate"><strong>Moderado</strong><span>Temperatura a partir de {formatTemperature(20, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} e condições que não atingem simultaneamente o calor e a frequência de chuva do nível alto.</span></li>
              <li className="weather-mosquito-level-high"><strong>Alto</strong><span>Temperatura de {formatTemperature(30, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} ou mais e pelo menos dois dos três dias com probabilidade de chuva de 50% ou mais.</span></li>
            </ul>
            <p className="weather-index-guide-note">
              É uma estimativa indicativa baseada apenas em temperatura e previsão de chuva.
            </p>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
