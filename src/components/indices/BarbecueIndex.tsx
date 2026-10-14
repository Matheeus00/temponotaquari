import type { ForecastDay, WeatherIndexData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { normalizeIndexLabel, parseIndexNumber } from './indexUtils';
import {
  formatTemperature,
  getTemperatureUnitLabel,
  type TemperatureUnit,
} from '../../utils/utils';

interface BarbecueIndexProps {
  data?: WeatherIndexData;
  cloudiness: number | string;
  forecast: ForecastDay[];
  temperatureUnit: TemperatureUnit;
}

const levels = [
  { label: 'Em área coberta', description: 'Previsão instável, com alta chance de chuva. Prefira um espaço coberto.' },
  { label: 'Melhor em área coberta', description: 'Pode haver chuva isolada ou muita nebulosidade. Planeje uma alternativa coberta.' },
  { label: 'Tá valendo', description: 'Condições razoáveis para aproveitar; acompanhe a previsão, pois pode haver variação.' },
  { label: 'Dia ideal', description: 'Poucas nuvens e baixa chance de chuva favorecem atividades ao ar livre.' },
  { label: 'Perfeito!', description: 'Tempo ensolarado e estável, com boas condições para curtir ao ar livre.' },
] as const;

const getBarbecueLevel = (value: number | string): number | undefined => {
  const rawValue = String(value).trim();
  const numericValue = Number(rawValue);
  if (rawValue !== '' && Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= 4) {
    return numericValue;
  }

  const normalized = normalizeIndexLabel(value);
  const prefixedLevel = normalized.match(/^([0-4])\s*[–-]/);
  if (prefixedLevel) return Number(prefixedLevel[1]);

  const levelByLabel: Record<string, number> = {
    'em area coberta': 0,
    'melhor em area coberta': 1,
    'ta valendo': 2,
    'dia ideal': 3,
    'perfeito!': 4,
    perfeito: 4,
  };
  return levelByLabel[normalized];
};

const getBarbecueIndex = (cloudiness: number | string, forecast: ForecastDay[]) => {
  const cloudinessValue = parseIndexNumber(cloudiness);
  if (
    !Number.isFinite(cloudinessValue)
    || cloudinessValue < 0
    || cloudinessValue > 100
    || forecast.length < 3
  ) {
    return undefined;
  }

  const nextThreeDays = forecast.slice(0, 3);
  const rainProbabilities = nextThreeDays.map((day) => parseIndexNumber(day.rain_probability));
  const maximumTemperatures = nextThreeDays.map((day) => parseIndexNumber(day.max));
  if (
    rainProbabilities.some((probability) =>
      !Number.isFinite(probability) || probability < 0 || probability > 100)
    || maximumTemperatures.some((temperature) => !Number.isFinite(temperature))
  ) {
    return undefined;
  }

  const rainyDays = rainProbabilities.filter((probability) => probability >= 50).length;
  const highestRainProbability = Math.max(...rainProbabilities);
  const highestTemperature = Math.max(...maximumTemperatures);
  let level: number;

  if (highestRainProbability >= 80 || rainyDays >= 2) {
    level = 0;
  } else if (
    highestRainProbability >= 50
    || cloudinessValue >= 70
    || highestTemperature < 16
    || highestTemperature > 36
  ) {
    level = 1;
  } else if (
    highestRainProbability <= 10
    && cloudinessValue <= 15
    && highestTemperature >= 22
    && highestTemperature <= 32
  ) {
    level = 4;
  } else if (
    highestRainProbability < 30
    && cloudinessValue <= 40
    && highestTemperature >= 18
    && highestTemperature <= 35
  ) {
    level = 3;
  } else {
    level = 2;
  }

  return { value: level, description: levels[level].description };
};

export const BarbecueIndex = ({
  data,
  cloudiness,
  forecast,
  temperatureUnit,
}: BarbecueIndexProps) => {
  const metric = data ?? getBarbecueIndex(cloudiness, forecast);
  const level = metric ? getBarbecueLevel(metric.value) : undefined;
  const displayValue = level === undefined
    ? metric?.value
    : `${levels[level].label}`;
  const temperatureRange = (minimum: number, maximum: number) =>
    `${formatTemperature(minimum, temperatureUnit)}–${formatTemperature(maximum, temperatureUnit)} ${getTemperatureUnitLabel(temperatureUnit)}`;

  return (
    <WeatherIndexCard
      id="barbecue"
      label="Churrasco"
      value={displayValue}
      description={metric?.description}
      level={level === undefined ? undefined : String(level)}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é calculado?">
          <div className="weather-index-guide-content">
            <h3>Estimativa de condições para churrasco</h3>
            <p>
              A estimativa considera a nebulosidade atual, as máximas e a probabilidade
              de chuva previstas para os próximos três dias. É uma referência para
              planejamento e pode mudar com a previsão.
            </p>
            <ul>
              <li className="weather-barbecue-level-0"><strong>Em área coberta</strong><span>Probabilidade de chuva de 80% ou mais em algum dia, ou de 50% ou mais em pelo menos dois dias.</span></li>
              <li className="weather-barbecue-level-1"><strong>Melhor em área coberta</strong><span>Chuva provável, nebulosidade atual de 70% ou mais, ou máxima abaixo de {formatTemperature(16, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} ou acima de {formatTemperature(36, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)}.</span></li>
              <li className="weather-barbecue-level-2"><strong>Tá valendo</strong><span>Sem chuva forte prevista, mas a nebulosidade, a chance de chuva ou a temperatura ficam fora dos critérios de um dia ideal.</span></li>
              <li className="weather-barbecue-level-3"><strong>Dia ideal</strong><span>Chance máxima de chuva abaixo de 30%, nebulosidade atual de até 40% e máxima prevista entre {temperatureRange(18, 35)}.</span></li>
              <li className="weather-barbecue-level-4"><strong>Perfeito!</strong><span>Chance máxima de chuva de até 10%, nebulosidade atual de até 15% e máxima entre {temperatureRange(22, 32)}.</span></li>
            </ul>
            <p className="weather-index-guide-note">
              A previsão do tempo pode mudar; confira novamente perto do evento e tenha
              uma alternativa coberta quando necessário.
            </p>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
