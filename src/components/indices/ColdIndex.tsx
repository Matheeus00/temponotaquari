import type { WeatherIndexData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { normalizeIndexLabel, parseIndexNumber } from './indexUtils';
import {
  formatTemperature,
  getTemperatureUnitLabel,
  type TemperatureUnit,
} from '../../utils/utils';

interface ColdIndexProps {
  data?: WeatherIndexData;
  humidity: number | string;
  temperature: number | string;
  temperatureUnit: TemperatureUnit;
}

type ColdLevel = 'low' | 'moderate' | 'high';

const getColdIndex = (temperature: number | string, humidity: number | string) => {
  const temperatureValue = parseIndexNumber(temperature);
  const humidityValue = parseIndexNumber(humidity);
  if (
    !Number.isFinite(temperatureValue)
    || !Number.isFinite(humidityValue)
    || humidityValue < 0
    || humidityValue > 100
  ) {
    return undefined;
  }

  if (temperatureValue >= 25 && humidityValue >= 60) {
    return {
      value: 0,
      description: 'Tempo quente e úmido, com menor potencial para desconfortos associados ao ar frio e seco.',
    };
  }
  if (temperatureValue <= 18 && humidityValue < 60) {
    return {
      value: 2,
      description: 'Tempo frio e seco. Hidratação e lavagem nasal com soro podem ajudar no conforto respiratório.',
    };
  }
  return {
    value: 1,
    description: 'Condições mais secas ou temperaturas amenas podem favorecer desconfortos respiratórios.',
  };
};

const getLevel = (value: number | string): ColdLevel | undefined => {
  const normalized = normalizeIndexLabel(value);
  if (normalized === '0' || normalized.startsWith('0 ') || normalized === 'baixo') return 'low';
  if (normalized === '1' || normalized.startsWith('1 ') || normalized === 'moderado') return 'moderate';
  if (normalized === '2' || normalized.startsWith('2 ') || normalized === 'alto') return 'high';
  return undefined;
};

const getDisplayValue = (value: number | string): string => {
  const level = getLevel(value);
  if (!level) return String(value);

  const levels: Record<ColdLevel, { score: number; label: string }> = {
    low: { score: 0, label: 'Baixo' },
    moderate: { score: 1, label: 'Moderado' },
    high: { score: 2, label: 'Alto' },
  };
  return `${levels[level].label}`;
};

export const ColdIndex = ({ data, humidity, temperature, temperatureUnit }: ColdIndexProps) => {
  const metric = data ?? getColdIndex(temperature, humidity);
  const level = metric ? getLevel(metric.value) : undefined;

  return (
    <WeatherIndexCard
      id="cold"
      label="Gripe/Resfriado"
      value={metric ? getDisplayValue(metric.value) : undefined}
      description={metric?.description}
      level={level}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é calculado?">
          <div className="weather-index-guide-content">
            <h3>Índice de condições para gripe e resfriado</h3>
            <p>
              O índice combina temperatura e umidade atuais como uma referência de conforto
              respiratório; não prevê infecções nem substitui orientação de saúde.
            </p>
            <ul>
              <li className="weather-cold-level-low"><strong>Baixo</strong><span>Temperatura a partir de {formatTemperature(25, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} e umidade de 60% ou mais: tempo quente e úmido.</span></li>
              <li className="weather-cold-level-moderate"><strong>Moderado</strong><span>Não se enquadra nos extremos: tempo quente e úmido (a partir de {formatTemperature(25, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} com umidade de 60% ou mais) nem frio e seco (até {formatTemperature(18, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} com umidade abaixo de 60%).</span></li>
              <li className="weather-cold-level-high"><strong>Alto</strong><span>Temperatura de até {formatTemperature(18, temperatureUnit)} {getTemperatureUnitLabel(temperatureUnit)} e umidade abaixo de 60%: tempo frio e seco.</span></li>
            </ul>
            <p className="weather-index-guide-note">
              Gripe e resfriado são causados por vírus; este índice não estima a chance de infecção.
              No nível 0, o índice não aponta necessidade de medidas extras por causa do tempo.
              No nível 2, hidratação, lavagem nasal com soro e umidificação do ambiente podem
              ajudar no conforto. Mantenha umidificadores limpos e evite sprays medicamentosos
              sem orientação profissional.
            </p>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
