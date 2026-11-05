import type { ForecastDay } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { normalizeIndexLabel, parseIndexNumber } from './indexUtils';
import {
  formatTemperature,
  getTemperatureUnitLabel,
  type TemperatureUnit,
} from '../../utils/utils';

interface BarbecueIndexProps {
  cloudiness: number | string;
  todayForecast?: ForecastDay;
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

const getBarbecueIndex = (
  cloudiness: number | string,
  todayForecast: ForecastDay | undefined,
) => {
  const cloudinessValue = parseIndexNumber(cloudiness);
  if (
    !Number.isFinite(cloudinessValue)
    || cloudinessValue < 0
    || cloudinessValue > 100
    || !todayForecast
  ) {
    return undefined;
  }

  const rainProbability = parseIndexNumber(todayForecast.rain_probability);
  const maximumTemperature = parseIndexNumber(todayForecast.max);
  if (!Number.isFinite(rainProbability) || rainProbability < 0 || rainProbability > 100
    || !Number.isFinite(maximumTemperature)) {
    return undefined;
  }

  let level: number;

  if (rainProbability >= 80) {
    level = 0;
  } else if (
    rainProbability >= 50
    || cloudinessValue >= 70
    || maximumTemperature < 16
    || maximumTemperature > 36
  ) {
    level = 1;
  } else if (
    rainProbability <= 10
    && cloudinessValue <= 15
    && maximumTemperature >= 22
    && maximumTemperature <= 32
  ) {
    level = 4;
  } else if (
    rainProbability < 30
    && cloudinessValue <= 40
    && maximumTemperature >= 18
    && maximumTemperature <= 35
  ) {
    level = 3;
  } else {
    level = 2;
  }

  return { value: level, description: levels[level].description };
};

export const BarbecueIndex = ({
  cloudiness,
  todayForecast,
  temperatureUnit,
}: BarbecueIndexProps) => {
  const metric = getBarbecueIndex(cloudiness, todayForecast);
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
              A estimativa considera a nebulosidade atual, a máxima e a probabilidade
              de chuva previstas para hoje. É uma referência para planejamento e pode
              mudar com a previsão.
            </p>
            <ul>
              <li className="weather-barbecue-level-0"><strong>Em área coberta</strong><span>Probabilidade de chuva hoje de 80% ou mais.</span></li>
              <li className="weather-barbecue-level-1"><strong>Melhor em área coberta</strong><span>Chuva provável hoje, nebulosidade atual de 70% ou mais, ou máxima prevista abaixo de {formatTemperature(16, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} ou acima de {formatTemperature(36, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)}.</span></li>
              <li className="weather-barbecue-level-2"><strong>Tá valendo</strong><span>Sem chuva forte prevista, mas a nebulosidade, a chance de chuva ou a temperatura ficam fora dos critérios de um dia ideal.</span></li>
              <li className="weather-barbecue-level-3"><strong>Dia ideal</strong><span>Chance de chuva hoje abaixo de 30%, nebulosidade atual de até 40% e máxima prevista entre {temperatureRange(18, 35)}.</span></li>
              <li className="weather-barbecue-level-4"><strong>Perfeito!</strong><span>Chance de chuva hoje de até 10%, nebulosidade atual de até 15% e máxima prevista entre {temperatureRange(22, 32)}.</span></li>
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
