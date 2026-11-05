import * as SunCalc from 'suncalc';
import './SkyAlerts.css';
import { DismissibleDetails } from '../common/DismissibleDetails';

interface RainbowAlertProps {
  precipitationMillimeters?: number;
  cloudCoverPercent?: number;
  latitude: number;
  longitude: number;
  date: Date;
}

export const RainbowAlert = ({
  precipitationMillimeters,
  cloudCoverPercent,
  latitude,
  longitude,
  date,
}: RainbowAlertProps) => {
  const solarElevationDegrees =
    SunCalc.getPosition(date, latitude, longitude).altitude * (180 / Math.PI);
  const precipitation = typeof precipitationMillimeters === 'number'
      && Number.isFinite(precipitationMillimeters)
    ? precipitationMillimeters
    : null;
  const cloudCover = typeof cloudCoverPercent === 'number'
      && Number.isFinite(cloudCoverPercent)
    ? cloudCoverPercent
    : null;
  const hasWeatherData = precipitation !== null && cloudCover !== null;
  const hasSuitableSolarElevation =
    solarElevationDegrees > 0 && solarElevationDegrees < 42;
  const rainbowConditionsFavorable =
    hasWeatherData &&
    precipitation !== null &&
    precipitation > 0.1 &&
    cloudCover !== null &&
    cloudCover < 75 &&
    hasSuitableSolarElevation;

  const reasons: string[] = [];
  if (!hasWeatherData) {
    reasons.push('Dados de chuva e nebulosidade indisponíveis.');
  } else {
    if (precipitation !== null && precipitation <= 0.1) {
      reasons.push('Chuva estimada abaixo do limite de 0,1 mm.');
    }
    if (cloudCover !== null && cloudCover >= 75) {
      reasons.push('Nebulosidade estimada em 75% ou mais.');
    }
  }
  if (solarElevationDegrees <= 0) {
    reasons.push('Sol abaixo do horizonte.');
  } else if (solarElevationDegrees >= 42) {
    reasons.push('Sol acima do limite de 42°.');
  }

  const description = rainbowConditionsFavorable
    ? `Há chuva e aberturas entre as nuvens estimadas. Elevação do Sol: ${Math.round(solarElevationDegrees)}°.`
    : reasons.join(' ');
  const status = !hasWeatherData
    ? 'DADOS INDISPONÍVEIS'
    : rainbowConditionsFavorable
      ? 'ESTIMATIVA FAVORÁVEL'
      : 'ESTIMATIVA DESFAVORÁVEL';

  return (
    <section className="sky-alerts sky-alerts-rainbow" aria-label="Condições para arco-íris">
      <aside
        className={`sky-alert sky-alert-rainbow${rainbowConditionsFavorable ? '' : ' sky-alert-rainbow-unfavorable'}`}
        aria-label="Possibilidade de arco-íris"
      >
        <div className="widget-heading sky-alert-heading">
          <span className="sky-alert-icon" aria-hidden="true">
            <img src="/condition/rainbow.svg" alt="" />
          </span>
          <div>
            <p className="widget-label">OBSERVAÇÃO DO CÉU</p>
            <h2>Arco-íris</h2>
          </div>
        </div>
        <div className="sky-alert-copy">
          <span className="sky-alert-label">CONDIÇÕES PARA ARCO-ÍRIS</span>
          <span className="sky-alert-description">{description}</span>
          <span className="sky-alert-badge">
            {rainbowConditionsFavorable ? 'FAVORÁVEL' : hasWeatherData ? 'NÃO FAVORÁVEL' : status}
          </span>
        </div>
        <div className="sky-alert-footer">
          <DismissibleDetails className="sky-alert-guide" summary="Como funciona esta estimativa?">
            <div className="sky-alert-guide-content">
              <h3>Condições consideradas</h3>
              <p>
                A estimativa considera chuva acima de 0,1 mm, nebulosidade abaixo de 75% e
                elevação solar entre 0° e 42°. Os dados de chuva e nuvens são estimativas
                meteorológicas para o local.
              </p>
              <p>
                Mesmo com condições favoráveis, isso não confirma que um arco-íris esteja visível.
                A chuva precisa estar na direção oposta ao Sol e o horizonte deve estar livre.
              </p>
            </div>
          </DismissibleDetails>
        </div>
      </aside>
    </section>
  );
};
