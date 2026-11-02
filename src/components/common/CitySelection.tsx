import { useState } from 'react';
import { TAQUARI_VALLEY_CITIES } from '../../constants/cities';
import './CitySelection.css';

interface CitySelectionProps {
  onConfirm: (cityId: string) => void;
  backgroundColor: string;
}

export const CitySelection = ({ onConfirm, backgroundColor }: CitySelectionProps) => {
  const [cityId, setCityId] = useState('');

  return (
    <main className="App page-shell city-selection-shell" style={{ backgroundColor }}>
      <section className="city-selection-card" aria-labelledby="city-selection-title">
        <span className="city-selection-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <p className="eyebrow">TEMPO NO TAQUARI</p>
        <h1 id="city-selection-title">Qual cidade você quer acompanhar?</h1>
        <p className="city-selection-description">
          Escolha uma cidade para ver a previsão e os avisos locais. Você pode alterá-la depois.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (cityId) onConfirm(cityId);
          }}
        >
          <label htmlFor="initial-city">Cidade</label>
          <select
            id="initial-city"
            autoFocus
            required
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
          >
            <option value="" disabled>Selecione uma cidade</option>
            {TAQUARI_VALLEY_CITIES.map((city) => (
              <option key={city.id} value={city.id}>{city.name}, RS</option>
            ))}
          </select>
          <button type="submit" disabled={!cityId}>Ver previsão</button>
        </form>
      </section>
    </main>
  );
};
