import type { WeatherIndexData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { normalizeIndexLabel, parseIndexNumber } from './indexUtils';

interface FrizzIndexProps {
  data?: WeatherIndexData;
  humidity: number | string;
}

type FrizzLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

const descriptions = {
  'very-low': { value: 'Muito baixo', description: 'Umidade baixa. Dia com pouca variação nos fios.' },
  low: { value: 'Baixo', description: 'Ar mais seco e estável. Menor tendência ao frizz.' },
  moderate: { value: 'Moderado', description: 'Umidade moderada. Condições equilibradas para os fios.' },
  high: { value: 'Alto', description: 'Ar úmido e instável. O frizz tende a aparecer ao longo do dia.' },
  'very-high': { value: 'Muito alto', description: 'Umidade elevada. Alta tendência ao frizz nos fios.' },
} satisfies Record<FrizzLevel, { value: string; description: string }>;

const getFrizzIndex = (humidity: number | string) => {
  const value = parseIndexNumber(humidity);
  if (!Number.isFinite(value) || value < 0 || value > 100) return undefined;
  if (value < 30) return { ...descriptions['very-low'], level: 'very-low' as const };
  if (value < 45) return { ...descriptions.low, level: 'low' as const };
  if (value < 65) return { ...descriptions.moderate, level: 'moderate' as const };
  if (value < 80) return { ...descriptions.high, level: 'high' as const };
  return { ...descriptions['very-high'], level: 'very-high' as const };
};

const getLevel = (value: string): FrizzLevel | undefined => {
  const normalized = normalizeIndexLabel(value).replace(/\s+/g, '-');
  const levels: Record<string, FrizzLevel> = {
    'muito-baixo': 'very-low',
    'very-low': 'very-low',
    baixo: 'low',
    low: 'low',
    moderado: 'moderate',
    moderada: 'moderate',
    moderate: 'moderate',
    alto: 'high',
    alta: 'high',
    high: 'high',
    'muito-alto': 'very-high',
    'muito-alta': 'very-high',
    'very-high': 'very-high',
  };
  return levels[normalized];
};

const guideLevels = [
  ['weather-frizz-level-very-low', 'Muito baixo', 'Abaixo de 30% — umidade baixa; pouca variação nos fios.'],
  ['weather-frizz-level-low', 'Baixo', 'De 30% a 44% — ar mais seco e estável.'],
  ['weather-frizz-level-moderate', 'Moderado', 'De 45% a 64% — condições equilibradas para os fios.'],
  ['weather-frizz-level-high', 'Alto', 'De 65% a 79% — ar úmido e instável; o frizz pode aparecer ao longo do dia.'],
  ['weather-frizz-level-very-high', 'Muito alto', '80% ou mais — umidade elevada e maior tendência ao frizz.'],
];

export const FrizzIndex = ({ data, humidity }: FrizzIndexProps) => {
  const fallbackMetric = getFrizzIndex(humidity);
  const metric = data ?? (fallbackMetric
    ? { value: fallbackMetric.value, description: fallbackMetric.description }
    : undefined);
  const level = data
    ? getLevel(String(data.value))
    : fallbackMetric?.level;

  return (
    <WeatherIndexCard
      id="frizz"
      label="Frizz"
      value={metric?.value}
      description={metric?.description}
      level={level}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é calculado?">
          <div className="weather-index-guide-content">
            <h3>Estimativa de tendência ao frizz</h3>
            <p>
              O nível é estimado pela umidade relativa do ar atual. É uma referência geral:
              o resultado nos fios também depende do tipo de cabelo e de outros fatores.
            </p>
            <ul>
              {guideLevels.map(([className, label, description]) => (
                <li className={className} key={className}>
                  <strong>{label}</strong><span>{description}</span>
                </li>
              ))}
            </ul>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
