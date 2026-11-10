import type { ForecastDay, WeatherIndexData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { parseIndexNumber } from './indexUtils';

interface SkinDrynessIndexProps {
  data?: WeatherIndexData;
  humidity: number | string;
  forecast: ForecastDay[];
}

type SkinDrynessLevel = 'low' | 'moderate' | 'high';

const getLevel = (value: string): SkinDrynessLevel | undefined => {
  const normalized = value.trim().toLocaleLowerCase('pt-BR');
  if (normalized === 'baixo') return 'low';
  if (normalized === 'moderado') return 'moderate';
  if (normalized === 'alto') return 'high';
  return undefined;
};

const getSkinDrynessIndex = (humidity: number | string, forecast: ForecastDay[]) => {
  const humidityValue = parseIndexNumber(humidity);
  if (
    !Number.isFinite(humidityValue)
    || humidityValue < 0
    || humidityValue > 100
    || forecast.length === 0
  ) {
    return undefined;
  }

  const rainProbabilities = forecast.slice(0, 3).map((day) => parseIndexNumber(day.rain_probability));
  if (rainProbabilities.some((probability) =>
    !Number.isFinite(probability) || probability < 0 || probability > 100)) {
    return undefined;
  }

  const rainyDays = rainProbabilities.filter((probability) => probability >= 50).length;
  const selectedDay = forecast.length === 1;
  if (humidityValue >= 65 || rainyDays >= (selectedDay ? 1 : 2)) {
    return {
      value: 'Baixo',
      description: selectedDay
        ? 'A umidade ou a chuva prevista reduzem a chance de ressecamento da pele neste dia.'
        : 'A presença de chuva ou o ar úmido reduzem a chance de ressecamento da pele.',
    };
  }
  if (humidityValue < 40 && rainyDays === 0) {
    return {
      value: 'Alto',
      description: selectedDay
        ? 'O ar seco e a ausência de chuva favorecem ressecamento intenso da pele neste dia.'
        : 'Tempo seco e sem chuva favorece ressecamento intenso da pele.',
    };
  }
  return {
    value: 'Moderado',
    description: selectedDay
      ? 'A umidade e a chance de chuva indicam potencial moderado de ressecamento neste dia.'
      : 'Ausência de chuva e umidade baixa favorecem leve ressecamento da pele.',
  };
};

const guideLevels = [
  ['weather-skin-dryness-level-low', 'Baixo', 'Umidade de 65% ou mais, ou probabilidade de chuva de 50% ou mais em pelo menos dois dias.'],
  ['weather-skin-dryness-level-moderate', 'Moderado', 'Condições entre os níveis baixo e alto; ausência de chuva e umidade mais baixa podem favorecer leve ressecamento.'],
  ['weather-skin-dryness-level-high', 'Alto', 'Umidade abaixo de 40% e nenhum dos três dias com probabilidade de chuva de 50% ou mais.'],
];

export const SkinDrynessIndex = ({ data, humidity, forecast }: SkinDrynessIndexProps) => {
  const metric = data ?? getSkinDrynessIndex(humidity, forecast);
  const level = metric ? getLevel(String(metric.value)) : undefined;

  return (
    <WeatherIndexCard
      id="skin-dryness"
      label="Ressecamento de pele"
      value={metric?.value}
      description={metric?.description}
      level={level}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é calculado?">
          <div className="weather-index-guide-content">
            <h3>Estimativa de ressecamento da pele</h3>
            <p>
              A estimativa considera a umidade relativa atual e a probabilidade de chuva
              nos próximos três dias. Um dia conta como chuvoso quando a probabilidade
              é de 50% ou mais.
            </p>
            <ul>
              {guideLevels.map(([className, label, description]) => (
                <li className={className} key={className}>
                  <strong>{label}</strong><span>{description}</span>
                </li>
              ))}
            </ul>
            <p className="weather-index-guide-note">
              É uma estimativa indicativa baseada apenas em umidade e previsão de chuva.
            </p>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
