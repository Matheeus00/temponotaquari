import type { OutdoorConditionsData } from '../../types';
import { DismissibleDetails } from '../common/DismissibleDetails';
import './OutdoorConditions.css';

interface OutdoorConditionsProps {
  data?: OutdoorConditionsData;
}

const getUvIconSource = (index: number): string | null => {
  if (!Number.isFinite(index) || index <= 0) {
    return null;
  }

  if (index > 11) {
    return '/uv/uv-index-11-plus.svg';
  }

  return `/uv/uv-index-${Math.round(index)}.svg`;
};

const getPollenIconSource = (level: string): string | null => {
  const normalizedLevel = level
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[_\s]+/g, '-');
  const iconLevel = {
    low: 'low',
    baixo: 'low',
    moderate: 'moderate',
    moderado: 'moderate',
    high: 'high',
    alto: 'high',
    'very-high': 'very-high',
    'muito-alto': 'very-high',
  }[normalizedLevel];

  return iconLevel ? `/pollen/pollen-weed-${iconLevel}.svg` : null;
};

export const OutdoorConditions = ({ data }: OutdoorConditionsProps) => {
  const uvIconSource = data?.uv ? getUvIconSource(data.uv.index) : null;
  const pollenIconSource = data?.pollen ? getPollenIconSource(data.pollen.level) : null;

  return (
    <section className="outdoor-section" aria-labelledby="outdoor-title">
      <div className="outdoor-heading">
        <span className="outdoor-heading-icon" aria-hidden="true">
          <svg className="outdoor-environment-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" />
            <path d="M7 14c2-1 4-1.5 6-1.5S17 13 19 14M8 9c1.2.7 2.5 1 4 1s2.8-.3 4-1M12 3v18" />
            <path d="M12 15c0-3.5 2.1-5.5 6-6-.2 3.8-2.1 6-6 6Zm0 2c0-2.8-1.7-4.4-4.8-4.8.2 3 1.8 4.8 4.8 4.8Z" />
          </svg>
        </span>
        <span className="outdoor-heading-copy">
          <span className="widget-label">AMBIENTE</span>
          <h2 id="outdoor-title">Índice UV, pólen e qualidade do ar</h2>
        </span>
      </div>
      <div className="outdoor-metrics">
        <article className="outdoor-card outdoor-card-uv">
          <span className="outdoor-icon" aria-hidden="true">
            {uvIconSource ? <img src={uvIconSource} alt="" /> : (
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            )}
          </span>
          <span className="outdoor-copy">
            <span>Índice UV</span>
            {data?.uv ? (
              <strong>{data.uv.index} <small>{data.uv.level}</small></strong>
            ) : (
              <strong className="outdoor-pending">Dados em breve</strong>
            )}
            <DismissibleDetails className="outdoor-guide" summary="Entenda o índice UV">
              <div className="outdoor-guide-content">
                <h3>O que é o índice UV?</h3>
                <p>
                  O índice UV mede a intensidade da radiação ultravioleta do sol e indica o potencial
                  de danos à pele e aos olhos. Quanto maior o número, maior a necessidade de proteção.
                </p>
                <ul>
                  <li><strong>0–2 · Baixo</strong><span>Risco baixo. Proteção costuma ser necessária apenas em exposições prolongadas.</span></li>
                  <li><strong>3–5 · Moderado</strong><span>Procure sombra e use protetor solar, chapéu e óculos de sol.</span></li>
                  <li><strong>6–7 · Alto</strong><span>Reduza a exposição ao sol, especialmente perto do meio-dia, e use proteção.</span></li>
                  <li><strong>8–10 · Muito alto</strong><span>Evite o sol nos horários de maior intensidade e reforce a proteção.</span></li>
                  <li><strong>11+ · Extremo</strong><span>Evite ficar ao sol. Se sair, use proteção completa e procure sombra.</span></li>
                </ul>
              </div>
            </DismissibleDetails>
          </span>
        </article>
        <article className="outdoor-card outdoor-card-pollen">
          <span className="outdoor-icon outdoor-icon-pollen" aria-hidden="true">
            {pollenIconSource ? <img src={pollenIconSource} alt="" /> : (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21v-8m0 4c-3.3 0-5-1.7-5-5 3.3 0 5 1.7 5 5Zm0-3c0-3.3 1.7-5 5-5 0 3.3-1.7 5-5 5Zm-1-6c-2.5-1.7-2.5-4.2-.8-6 2.5 1.7 3.3 3.4.8 6Z" />
              </svg>
            )}
          </span>
          <span className="outdoor-copy">
            <span>Pólen</span>
            {data?.pollen ? (
              <>
                <strong>{data.pollen.level}</strong>
                <small>{data.pollen.description}</small>
              </>
            ) : (
              <strong className="outdoor-pending">Dados em breve</strong>
            )}
            <DismissibleDetails className="outdoor-guide" summary="Entenda o nível de pólen">
              <div className="outdoor-guide-content">
                <h3>Como interpretar o nível de pólen?</h3>
                <p>
                  O nível representa a quantidade de pólen no ar. As faixas e os efeitos podem variar
                  conforme a fonte de dados, o tipo de pólen, o clima e a sensibilidade de cada pessoa.
                </p>
                <ul>
                  <li><strong>Baixo</strong><span>Menor concentração no ar; sintomas alérgicos são menos prováveis.</span></li>
                  <li><strong>Moderado</strong><span>Pessoas mais sensíveis podem apresentar sintomas.</span></li>
                  <li><strong>Alto</strong><span>Maior chance de sintomas; pessoas alérgicas podem reduzir a exposição ao ar livre.</span></li>
                  <li><strong>Muito alto</strong><span>Concentração elevada; pessoas sensíveis devem limitar a exposição e seguir as orientações de saúde que já receberam.</span></li>
                </ul>
              </div>
            </DismissibleDetails>
          </span>
        </article>
        <article className="outdoor-card outdoor-card-air">
          <span className="outdoor-icon outdoor-icon-air" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 8h12a2.5 2.5 0 1 0-2.5-2.5M2 12h17a2.5 2.5 0 1 1-2.5 2.5M4 16h8a2 2 0 1 1-2 2" />
            </svg>
          </span>
          <span className="outdoor-copy">
            <span>Qualidade do ar</span>
            {data?.airQuality ? (
              <>
                <strong>{data.airQuality.index} <small>{data.airQuality.level}</small></strong>
                {data.airQuality.description && <small>{data.airQuality.description}</small>}
              </>
            ) : (
              <strong className="outdoor-pending">Dados em breve</strong>
            )}
            <DismissibleDetails className="outdoor-guide" summary="Entenda a qualidade do ar">
              <div className="outdoor-guide-content">
                <h3>Como interpretar o índice de qualidade do ar?</h3>
                <p>
                  O índice resume a concentração de poluentes no ar. Nesta referência, os intervalos
                  seguem o Índice de Qualidade do Ar (AQI) da Agência de Proteção Ambiental dos
                  Estados Unidos (EPA). A escala e os limites podem variar conforme a fonte utilizada.
                </p>
                <ul>
                  <li><strong>0–50 · Bom</strong><span>A qualidade do ar é considerada satisfatória e oferece pouco ou nenhum risco.</span></li>
                  <li><strong>51–100 · Moderado</strong><span>Pode haver preocupação para pessoas excepcionalmente sensíveis.</span></li>
                  <li><strong>101–150 · Prejudicial a grupos sensíveis</strong><span>Pessoas sensíveis podem sentir efeitos; a maioria não deve ser afetada.</span></li>
                  <li><strong>151–200 · Prejudicial</strong><span>Algumas pessoas podem sentir efeitos; grupos sensíveis podem apresentar efeitos mais sérios.</span></li>
                  <li><strong>201–300 · Muito prejudicial</strong><span>O risco é maior para a saúde; grupos sensíveis devem evitar esforços ao ar livre.</span></li>
                  <li><strong>301–500 · Perigoso</strong><span>Condição de alerta: todos podem ser afetados e devem reduzir a exposição.</span></li>
                </ul>
              </div>
            </DismissibleDetails>
          </span>
        </article>
      </div>
    </section>
  );
};
