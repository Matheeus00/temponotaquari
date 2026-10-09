import type { ReactNode } from 'react';
import type { WeatherIndexId } from '../../types';
import { IndexIcon } from './IndexIcon';

interface WeatherIndexCardProps {
  id: WeatherIndexId;
  label: string;
  value?: ReactNode;
  description?: string;
  level?: string;
  guide?: ReactNode;
}

export const WeatherIndexCard = ({
  id,
  label,
  value,
  description,
  level,
  guide,
}: WeatherIndexCardProps) => (
  <article className={`weather-index-card${level ? ` weather-index-card-${id}-${level}` : ''}`}>
    <span
      className={`weather-index-icon weather-index-icon-${id}${level ? ` weather-index-icon-${id}-${level}` : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none">
        <IndexIcon id={id} />
      </svg>
    </span>
    <span className="weather-index-copy">
      <strong>{label}</strong>
      {value !== undefined ? (
        <>
          <span className="weather-index-value">{value}</span>
          {description && <span className="weather-index-description">{description}</span>}
          {guide}
        </>
      ) : (
        <span className="weather-index-pending">Dados em breve</span>
      )}
    </span>
  </article>
);
