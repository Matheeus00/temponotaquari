import type { WeatherIndexData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { WeatherIndexCard } from './WeatherIndexCard';
import { normalizeIndexLabel } from './indexUtils';

interface VitaminDIndexProps {
  data?: WeatherIndexData;
  uvIndex?: number;
}

type VitaminDLevel = 'low' | 'moderate' | 'high';

const getVitaminDIndex = (uvIndex?: number) => {
  if (!Number.isFinite(uvIndex) || uvIndex === undefined || uvIndex < 0) return undefined;
  if (uvIndex < 3) {
    return {
      value: 0,
      description: 'Radiação UV baixa, com potencial reduzido para a síntese natural de vitamina D.',
    };
  }
  if (uvIndex < 6) {
    return {
      value: 1,
      description: 'Radiação UV moderada, com potencial parcial para a síntese natural de vitamina D.',
    };
  }
  return {
    value: 2,
    description: 'Radiação UV alta, favorável à síntese natural de vitamina D, mas que exige proteção solar.',
  };
};

const getLevel = (value: number | string): VitaminDLevel | undefined => {
  const normalized = normalizeIndexLabel(value);
  if (normalized === '0' || normalized.startsWith('0 ') || normalized === 'baixo') return 'low';
  if (normalized === '1' || normalized.startsWith('1 ') || normalized === 'moderado') return 'moderate';
  if (normalized === '2' || normalized.startsWith('2 ') || normalized === 'alto') return 'high';
  return undefined;
};

const getDisplayValue = (value: number | string): string => {
  const level = getLevel(value);
  if (!level) return String(value);

  const levels: Record<VitaminDLevel, { score: number; label: string }> = {
    low: { score: 0, label: 'Baixo' },
    moderate: { score: 1, label: 'Moderado' },
    high: { score: 2, label: 'Alto' },
  };
  return `${levels[level].score} – ${levels[level].label}`;
};

export const VitaminDIndex = ({ data, uvIndex }: VitaminDIndexProps) => {
  const metric = data ?? getVitaminDIndex(uvIndex);
  const level = metric ? getLevel(metric.value) : undefined;

  return (
    <WeatherIndexCard
      id="vitamin-d"
      label="Vitamina D"
      value={metric ? getDisplayValue(metric.value) : undefined}
      description={metric?.description}
      level={level}
      guide={(
        <DismissibleDetails className="weather-index-guide" summary="Como é calculado?">
          <div className="weather-index-guide-content">
            <h3>Potencial de síntese natural de vitamina D</h3>
            <p>
              A estimativa usa o índice UV atual como referência da intensidade da radiação
              ultravioleta que chega ao solo. Ela não mede a vitamina D no organismo nem
              substitui orientação de saúde.
            </p>
            <ul>
              <li className="weather-vitamin-d-level-low"><strong>0 – Baixo</strong><span>Índice UV de 0 a 2: radiação baixa, com potencial reduzido para a síntese natural.</span></li>
              <li className="weather-vitamin-d-level-moderate"><strong>1 – Moderado</strong><span>Índice UV de 3 a 5: radiação moderada, favorecendo parcialmente a síntese natural.</span></li>
              <li className="weather-vitamin-d-level-high"><strong>2 – Alto</strong><span>Índice UV a partir de 6: radiação alta, favorável à síntese natural.</span></li>
            </ul>
            <p className="weather-index-guide-note">
              Um UV mais alto também aumenta o risco de danos à pele e aos olhos. Não se
              exponha sem proteção para tentar elevar a vitamina D; siga as recomendações
              de proteção solar e procure orientação profissional sobre suas necessidades.
            </p>
          </div>
        </DismissibleDetails>
      )}
    />
  );
};
