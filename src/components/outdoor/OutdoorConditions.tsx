import type { OutdoorConditionsData } from '../../types';
import {
  calculateDewPointCelsius,
  dayHour,
  formatTemperature,
  getTemperatureUnitLabel,
  type TemperatureUnit,
} from '../../utils/utils';
import { DismissibleDetails } from '../common/DismissibleDetails';
import './OutdoorConditions.css';

interface OutdoorConditionsProps {
  data?: OutdoorConditionsData;
  temperatureUnit: TemperatureUnit;
  temperature: number | string;
  humidity: number | string;
  airQualityError?: string | null;
  isAirQualityLoading?: boolean;
  uvIndexError?: string | null;
  isUvIndexLoading?: boolean;
}

const getUvIconSource = (index: number): string | null => {
  if (!Number.isFinite(index) || index < 0) {
    return null;
  }

  if (index < 0.5) {
    return '/uv/uv-index-0.svg';
  }

  if (index >= 11) {
    return '/uv/uv-index-11-plus.svg';
  }

  return `/uv/uv-index-${Math.max(1, Math.round(index))}.svg`;
};

const getAirQualityIconSource = (index: number): string | null => {
  if (!Number.isFinite(index) || index < 0) {
    return null;
  }

  if (index >= 0 && index <= 50) {
    return '/air-quality/good.svg';
  }

  if (index >= 51 && index <= 100) {
    return '/air-quality/moderate.svg'
  }

  if (index >= 101 && index <= 150) {
    return '/air-quality/harmful_sensible.svg'
  }

  if (index >= 151 && index <= 200) {
    return '/air-quality/harmful.svg'
  }

  if (index >= 201 && index <= 300) {
    return '/air-quality/very-harmful.svg'
  }

  return '/air-quality/dangerous.svg'
}

const getDewPointLevel = (dewPointCelsius: number) => {
  if (dewPointCelsius < 10) {
    return { className: 'dry', label: 'Ar seco · confortável' };
  }
  if (dewPointCelsius < 16) {
    return { className: 'pleasant', label: 'Agradável' };
  }
  if (dewPointCelsius < 21) {
    return { className: 'humid', label: 'Perceptivelmente úmido' };
  }
  if (dewPointCelsius < 25) {
    return { className: 'uncomfortable', label: 'Desconfortável · abafado' };
  }
  return { className: 'oppressive', label: 'Opressivo · tropical' };
};

export const OutdoorConditions = ({
  data,
  temperatureUnit,
  temperature,
  humidity,
  airQualityError,
  isAirQualityLoading = false,
  uvIndexError,
  isUvIndexLoading = false,
}: OutdoorConditionsProps) => {
  const uvIconSource = data?.uv ? getUvIconSource(data.uv.index) : null;
  const airQualityIconSource = data?.airQuality ? getAirQualityIconSource(data.airQuality.index) : null;
  const openMeteoDewPoint = data?.uv?.dewPointCelsius;
  const fallbackDewPoint = calculateDewPointCelsius(temperature, humidity);
  const hasOpenMeteoDewPoint =
    typeof openMeteoDewPoint === 'number' && Number.isFinite(openMeteoDewPoint);
  const hour = dayHour();
  const isNight = data?.uv?.isDay === false
    || (data?.uv?.isDay === undefined && (hour < 6 || hour > 18));
  const dewPoint = hasOpenMeteoDewPoint ? openMeteoDewPoint : fallbackDewPoint;
  const hasDewPoint = typeof dewPoint === 'number' && Number.isFinite(dewPoint);
  const dewPointLevel = hasDewPoint ? getDewPointLevel(dewPoint) : null;
  const formatDewPointGuideTemperature = (value: number) =>
    `${formatTemperature(value, temperatureUnit)} ${getTemperatureUnitLabel(temperatureUnit)}`;
  return (
    <section className="outdoor-section" aria-labelledby="outdoor-title">
      <div className="outdoor-heading">
        <span className="outdoor-heading-icon" aria-hidden="true" />
        <span className="outdoor-heading-copy">
          <span className="widget-label">AMBIENTE</span>
          <h2 id="outdoor-title">Condições ambientais</h2>
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
              <>
                <strong>
                  {data.uv.index.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                  {' '}<small>{data.uv.level}</small>
                </strong>
                {data.uv.index < 0.5 && isNight && (
                  <span className="outdoor-uv-night">Noite</span>
                )}
              </>
            ) : (
              <>
                <strong className="outdoor-pending">
                  {uvIndexError ? 'Indisponível' : isUvIndexLoading ? 'Carregando...' : 'Sem dados'}
                </strong>
                {uvIndexError && <small>{uvIndexError}</small>}
              </>
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
        <article className="outdoor-card outdoor-card-dew-point">
          <span className="outdoor-icon outdoor-icon-dew-point" aria-hidden="true">
            <img src='/dew_point/thermometer-raindrop.svg' />
          </span>
          <span className="outdoor-copy">
            <span>Ponto de orvalho</span>
            {hasDewPoint ? (
              <>
                <strong>
                  {formatTemperature(dewPoint, temperatureUnit)}
                  {' '}<small>{getTemperatureUnitLabel(temperatureUnit)}</small>
                </strong>
                {!hasOpenMeteoDewPoint && (
                  <small className="outdoor-dew-point-source">Estimado com dados da HG Brasil</small>
                )}
                {dewPointLevel && (
                  <span className={`outdoor-dew-point-level outdoor-dew-point-level-${dewPointLevel.className}`}>
                    {dewPointLevel.label}
                  </span>
                )}
              </>
            ) : (
              <strong className="outdoor-pending">
                {uvIndexError ? 'Indisponível' : isUvIndexLoading ? 'Carregando...' : 'Sem dados'}
              </strong>
            )}
            <DismissibleDetails className="outdoor-guide" summary="Entenda o ponto de orvalho">
              <div className="outdoor-guide-content">
                <h3>O que é o ponto de orvalho?</h3>
                <p>
                  É a temperatura até a qual o ar precisaria esfriar, mantendo a mesma quantidade
                  de vapor d’água, para ficar saturado e começar a condensar. Quanto mais alto,
                  maior costuma ser a sensação de umidade e abafamento.
                </p>
                <p>
                  Quando o ponto de orvalho do Open-Meteo não estiver disponível, ele é estimado
                  pela fórmula de Magnus-Tetens usando temperatura e umidade relativa da HG Brasil.
                </p>
                <ul>
                  <li className="outdoor-dew-point-guide-dry"><strong>Abaixo de {formatDewPointGuideTemperature(10)} · Ar seco e confortável</strong></li>
                  <li className="outdoor-dew-point-guide-pleasant"><strong>{formatDewPointGuideTemperature(10)}–{formatDewPointGuideTemperature(15)} · Agradável</strong></li>
                  <li className="outdoor-dew-point-guide-humid"><strong>{formatDewPointGuideTemperature(16)}–{formatDewPointGuideTemperature(20)} · Perceptivelmente úmido</strong></li>
                  <li className="outdoor-dew-point-guide-uncomfortable"><strong>{formatDewPointGuideTemperature(21)}–{formatDewPointGuideTemperature(24)} · Desconfortável e abafado</strong></li>
                  <li className="outdoor-dew-point-guide-oppressive"><strong>{formatDewPointGuideTemperature(25)} ou mais · Opressivo (tropical)</strong></li>
                </ul>
                <p className="outdoor-guide-note">
                  São faixas de referência; a sensação também varia conforme as condições e a
                  sensibilidade de cada pessoa.
                </p>
              </div>
            </DismissibleDetails>
          </span>
        </article>
        {/*
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
        */}
        <article className="outdoor-card outdoor-card-air">
          <span className="outdoor-icon outdoor-icon-air" aria-hidden="true">
            {airQualityIconSource ? <img src={airQualityIconSource} alt="" /> : (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 8h12a2.5 2.5 0 1 0-2.5-2.5M2 12h17a2.5 2.5 0 1 1-2.5 2.5M4 16h8a2 2 0 1 1-2 2" />
              </svg>
            )}
          </span>
          <span className="outdoor-copy">
            <span>Qualidade do ar</span>
            {data?.airQuality ? (
              <>
                <strong>{data.airQuality.index} <small>AQI</small></strong>
                <span
                  className={`outdoor-air-level${data.airQuality.index <= 50 ? ' outdoor-air-level-good' : ''}`}
                >
                  {data.airQuality.level}
                </span>
                {data.airQuality.pollutants.length > 0 && (
                  <span className="outdoor-air-pollutants">
                    {data.airQuality.pollutants.map((pollutant) => (
                      <span key={pollutant.name}>
                        <strong>{pollutant.name}</strong>
                        {pollutant.value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} μg/m³
                      </span>
                    ))}
                  </span>
                )}
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
