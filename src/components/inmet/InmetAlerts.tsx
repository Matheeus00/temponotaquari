import type { InmetAlert } from '../../types';
import './InmetAlerts.css';

interface InmetAlertsProps {
  alerts: InmetAlert[];
  error: string | null;
  cityName: string;
}

const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

const getAlertIcon = (phenomenon: string): string => {
  const normalizedPhenomenon = normalizeText(phenomenon);
  if (normalizedPhenomenon.includes('tornado')) return 'tornado';
  if (normalizedPhenomenon.includes('tromba')) return 'waterspout';
  if (normalizedPhenomenon.includes('ciclone') || normalizedPhenomenon.includes('furacao')) {
    return 'hurricane';
  }
  return 'weather-alert';
};

const getSeverityClass = (severity: string): string => {
  const normalizedSeverity = normalizeText(severity);
  if (normalizedSeverity.includes('grande perigo')) return 'extreme';
  if (normalizedSeverity === 'perigo') return 'high';
  return 'potential';
};

const formatInmetDate = (dateTime: string): string => {
  const match = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2})$/);
  if (!match) return dateTime;
  return `${match[3]}/${match[2]}/${match[1]} às ${match[4]}`;
};

export const InmetAlerts = ({ alerts, error, cityName }: InmetAlertsProps) => {
  if (error) {
    return (
      <p className="inmet-alerts-status" role="status">
        Avisos do INMET temporariamente indisponíveis.
      </p>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <section className="inmet-alerts" aria-label="Avisos meteorológicos oficiais do INMET">
      {alerts.map((alert) => {
        const severityClass = getSeverityClass(alert.severity);
        const icon = getAlertIcon(alert.phenomenon);
        return (
          <article
            key={alert.id}
            className={`inmet-alert inmet-alert-${severityClass}`}
            aria-label={`${alert.phenomenon}: ${alert.severity}`}
          >
            <span className="inmet-alert-icon" aria-hidden="true">
              <img src={`/condition/${icon}.svg`} alt="" />
            </span>
            <div className="inmet-alert-content">
              <span className="inmet-alert-source">AVISO OFICIAL · INMET</span>
              <h2>{alert.phenomenon}</h2>
              <strong className="inmet-alert-severity">{alert.severity}</strong>
              <p className="inmet-alert-validity">Aviso aplicável a {cityName}, RS.</p>
              {alert.risks.map((risk) => (
                <p className="inmet-alert-risk" key={risk}>{risk}</p>
              ))}
              <p className="inmet-alert-validity">
                Válido de {formatInmetDate(alert.start)} até {formatInmetDate(alert.end)}
              </p>
              {alert.instructions.length > 0 && (
                <details className="inmet-alert-instructions">
                  <summary>Orientações oficiais</summary>
                  <ul>
                    {alert.instructions.map((instruction) => (
                      <li key={instruction}>{instruction}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
};
