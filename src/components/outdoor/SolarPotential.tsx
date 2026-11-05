import { dayHour } from '../../utils/utils';
import { DismissibleDetails } from '../common/DismissibleDetails';
import './SolarPotential.css';

interface SolarPotentialProps {
  isDay?: boolean;
  radiation?: number;
  error?: string | null;
  isLoading?: boolean;
}

const getSolarLevel = (radiation: number) => {
  if (radiation < 200) return { label: 'Baixo', icon: 'panel-low' };
  if (radiation < 500) return { label: 'Médio', icon: 'panel-medium' };
  return { label: 'Alto', icon: 'panel-high' };
};

export const SolarPotential = ({
  isDay,
  radiation,
  error,
  isLoading = false,
}: SolarPotentialProps) => {
  const hour = dayHour();
  const isNight = isDay === false || (isDay === undefined && (hour < 6 || hour > 18));
  const solarLevel = typeof radiation === 'number' && Number.isFinite(radiation)
    ? getSolarLevel(radiation)
    : null;
  const panelIcon = isNight ? 'panel-alert' : solarLevel?.icon;

  return (
    <article className="solar-potential-card" aria-label="Potencial solar">
      <div className="widget-heading solar-potential-heading">
        <span className="solar-potential-category-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5.5" />
            <path d="M12 1v5.5m0 11V23M4.22 4.22l3.89 3.89m7.78 7.78 3.89 3.89M1 12h5.5m11 0H23M4.22 19.78l3.89-3.89m7.78-7.78 3.89-3.89" />
          </svg>
        </span>
        <div>
          <p className="widget-label">ENERGIA SOLAR</p>
          <h2>Potencial solar</h2>
        </div>
      </div>
      <div className="solar-potential-content">
        {panelIcon && (
          <span className="solar-potential-panel-icon" aria-hidden="true">
            <img src={`/solar/${panelIcon}.svg`} alt="" />
          </span>
        )}
        <div className="solar-potential-copy">
          {isNight ? (
            <>
              <strong>Sem geração · noite</strong>
              <span>Radiação solar indisponível neste horário</span>
            </>
          ) : solarLevel && typeof radiation === 'number' ? (
            <>
              <strong>
                {radiation.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                {' '}<small>W/m²</small>
              </strong>
              <span className="solar-potential-level">{solarLevel.label}</span>
            </>
          ) : (
            <strong className="solar-potential-pending">
              {error ? 'Indisponível' : isLoading ? 'Carregando...' : 'Sem dados'}
            </strong>
          )}
        </div>
      </div>
      <DismissibleDetails className="solar-potential-guide" summary="Sobre o potencial solar">
        <div className="solar-potential-guide-content">
          <h3>Estimativa de radiação solar</h3>
          <p>
            O nível usa a radiação solar estimada pelo Open-Meteo no momento,
            medida em watts por metro quadrado (W/m²). É uma referência das
            condições para geração, não uma medição da energia produzida por
            um painel específico.
          </p>
          <ul>
            <li><strong>Baixo</strong><span>Abaixo de 200 W/m².</span></li>
            <li><strong>Médio</strong><span>De 200 a 499 W/m².</span></li>
            <li><strong>Alto</strong><span>A partir de 500 W/m².</span></li>
            <li><strong>Noite</strong><span>Sem radiação solar para geração.</span></li>
          </ul>
        </div>
      </DismissibleDetails>
    </article>
  );
};
